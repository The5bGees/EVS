'use strict';
//TODO might need to be fix
/**
 * Module dependencies.
 */
let path = require('path'),
  mongoose = require('mongoose'),
  Oil = mongoose.model('Oil'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  fs = require('fs'),
  oilConfig = config.uploads.oil;

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

/**
 * Deletes Icon
 */
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
  let fileInfo = oilConfig.icon;
  let singleName = 'iconImage';

  uploadFile(fileInfo, singleName, req, res)
    .then(function (r) {
      return res.status(200).send(r);
    }).catch(function (err) {
    return res.send({message: errorHandler.getErrorMessage(err)});
  })
};


/**
 * Create a Oil
 */
exports.create = function (req, res) {
  let oil = new Oil(req.body);
  oil.user = req.user;
  oil.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      return res.json(oil);
    }
  });
};

/**
 * Show the current Oil
 */
exports.read = function (req, res) {
  res.json(req.oil);
};

/**
 * Update an Oil
 */
exports.update = function (req, res) {
  let oil = req.oil;

  oil.botanical_name = req.body.botanical_name;
  oil.description = req.body.description;
  oil.color = req.body.color;
  oil.icon = req.body.icon;

  oil.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(oil);
    }
  });
};

/**
 * Delete an Oil
 */
exports.delete = function (req, res) {
  let oil = req.oil;

  oil.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(oil);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Oil.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

/**
 * Oil middleware
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
