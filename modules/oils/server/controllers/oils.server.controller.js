'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Oil = mongoose.model('Oil'),
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
 * Create a Oil
 */
exports.create = function (req, res) {
  var oil = new Oil(req.body);
  oil.user = req.user;

  oil.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(oil);
    }
  });
};

/**
 * Show the current oil
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var oil = req.oil ? req.oil.toJSON() : {};

  // Add a custom field to the oil, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Oil model.
  oil.isCurrentUserOwner = !!(oil.user && oil.user && oil.user._id.toString() === req.user._id.toString());

  res.json(oil);
};

/**
 * Update a oil
 */
exports.update = function (req, res) {
  var oil = req.oil;

  oil.name = req.body.name;
  oil.botanical = req.body.botanical;
  oil.compound = req.body.compound;
  oil.color = req.body.color;
  oil.icon = req.body.icon;


  oil.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(oil);
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
    multerConfig = config.uploads.oil.icon;
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
 * Delete a oil
 */
exports.delete = function (req, res) {
  var oil = req.oil;

  oil.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(oil);
    }
  });
};

/**
 * List of Oils
 */
exports.list = function (req, res) {
  Oil.find().sort('-created').populate('user', 'displayName').exec(function (err, oils) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(oils);
    }
  });
};

/**
 * Article middleware
 */
exports.oilByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Oil is invalid'
    });
  }

  Oil.findById(id).populate('user', 'displayName').exec(function (err, oil) {
    if (err) {
      return next(err);
    } else if (!oil) {
      return res.status(404).send({
        message: 'No oil with that identifier has been found'
      });
    }
    req.oil = oil;
    next();
  });
};
