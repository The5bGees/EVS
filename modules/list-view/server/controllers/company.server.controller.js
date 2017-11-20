'use strict';
//TODO might need to be fix
/**
 * Module dependencies.
 */
let path = require('path'),
  mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  fs = require('fs'),
  companyConfig = config.uploads.company;


/**
 * function for uploading files
 */
let uploadFile = function (fileInfo, singleName, req, res) {
  let upload = multer(fileInfo).single(singleName);
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
        return resolve({
          message: 'Icon save',
          file: req.file
        });
      }
    });
  });
};


exports.deleteIcon = function(req, res){
  let iconName =  req.query.path;

  try {
    fs.unlinkSync(iconName);
    return res.status(200).send('icon deleted');

  }catch(err){
    return res.status(422)
      .send("Error: " + iconName + " file doesn't exist");
  }
};

/**
 * Upload Icon
 */
exports.uploadIcon = function (req, res) {
  let fileInfo = companyConfig.icon;
  let singleName = 'iconImage';

  uploadFile(fileInfo, singleName, req, res)
    .then(function (r) {
      return res.status(200).send(r);
    }).catch(function (err) {
    return res.send({message: errorHandler.getErrorMessage(err)});
  })
};


/**
 * Create a Company
 */
exports.create = function (req, res) {
  console.log(req.body);
  let company = new Company(req.body);
  company.user = req.user;
  company.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      return res.json(company);
    }
  });
};

/**
 * Show the current Company
 */
exports.read = function (req, res) {
  res.json(req.company);
};

/**
 * Update a company
 */
exports.update = function (req, res) {
  let company = req.company;

  company.last_report_date = req.body.last_report_date;
  company.description = req.body.description;
  company.reports = req.body.reports;
  company.color = req.body.color;
  company.icon = req.body.icon;
  company.companyUrl = req.body.companyUrl;


  company.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(company);
    }
  });
};

/**
 * Delete a company
 */
exports.delete = function (req, res) {
  let company = req.company;

  company.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(company);
    }
  });
};

/**
 * List of Company
 */
exports.list = function (req, res) {
  Company.find().sort('-created').populate('user', 'displayName').exec(function (err, company) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(company);
    }
  });
};

/**
 * Company middleware
 */
exports.ParamID = function (req, res, next, id) {

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
        message: 'No Company with that identifier has been found'
      });
    }
    req.company = company;
    next();
  });
};
