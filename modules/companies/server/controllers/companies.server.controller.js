'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  multer = require('multer'),
  multerS3 = require('multer-s3'),
  aws = require('aws-sdk'),
  amazonS3URI = require('amazon-s3-uri'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var useS3Storage = config.uploads.storage === 's3' && config.aws.s3;
var s3;

if (useS3Storage) {
  aws.config.update({
    accessKeyId: config.aws.s3.accessKeyId,
    secretAccessKey: config.aws.s3.secretAccessKey
  });
  s3 = new aws.S3();
}

/**
 * Create a company
 */
exports.create = function (req, res) {
  var company = new Company(req.body);
  company.user = req.user;

  company.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(company);
    }
  });
};

/**
 * Show the current company
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var company = req.company ? req.company.toJSON() : {};

  // Add a custom field to the company, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Company model.
  company.isCurrentUserOwner = !!(company.user && company.user && company.user._id.toString() === req.user._id.toString());

  res.json(company);
};

/**
 * Update a company
 */
exports.update = function (req, res) {
  var company = req.company;

  company.name = req.body.name;
  company.url = req.body.url;
  company.color = req.body.color;
  company.description = req.body.description;
  company.icon = req.body.icon;


  company.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(company);
    }
  });
};

exports.uploadIcon = function (req, res) {
  var multerConfig;
  if (useS3Storage) {
    multerConfig = {
      storage: multerS3({
        s3: s3,
        bucket: config.aws.s3.bucket,
        acl: 'public-read'
      })
    };
  } else {
    multerConfig = config.uploads.company.icon;
  }

  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;

  var upload = multer(multerConfig).single('icon');
  uploadImage()
    .then(function (r) {
      return res.status(200).send(r);
    })
    .catch(function (err) {
      res.status(422).send(err);
    });

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          return reject({
            err: uploadError,
            message: 'Error occurred while uploading file'
          });
        } else {
          if (!req.file) {
            return reject({
              message: 'Error saving file'
            });
          }
          else {
            var path = config.uploads.storage === 's3' && config.aws.s3 ?
              req.file.location : '/' + req.file.path;
            console.log(config.uploads.storage);
            console.log(path);
            return resolve({
              message: 'Icon save',
              url: path
            });
          }
        }
      });
    });
  }
};

/**
 * Delete a company
 */
exports.delete = function (req, res) {
  var company = req.company;

  company.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(company);
    }
  });
};

/**
 * List of Companies
 */
exports.list = function (req, res) {
  Company.find().sort('-created').populate('user', 'displayName').exec(function (err, companies) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(companies);
    }
  });
};

/**
 * Article middleware
 */
exports.companyByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Company is invalid'
    });
  }

  Company.findById(id).populate('user', 'displayName').exec(function (err, company) {
    if (err) {
      return next(err);
    } else if (!company) {
      return res.status(404).send({
        message: 'No company with that identifier has been found'
      });
    }
    req.company = company;
    next();
  });
};
