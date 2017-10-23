'use strict';
//TODO might need to be fix
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Oil = mongoose.model('Oil'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  fs = require('fs-extra');

/**
 * Upload Icon
 */
//TODO: remove icon if the image didn't save
exports.uploadIcon = function (req, res) {
  var fileInfo = config.uploads.oil.temp;
  var upload = multer(fileInfo).single('iconImage');

  upload(req, res, function (uploadError) {
    if (uploadError) {
      return res.status(400).send({
        message: 'Error occurred while uploading Oil Icon image'
      });
    } else {
      return res.send({
        message: 'All good',
        filename: req.file.filename
      });
    }
  });
};


/**
 * Create a Oil
 */
exports.create = function (req, res) {
  var oil = new Oil(req.body);
  console.log(req.body);
  oil.user = req.user;
  var icon = req.body.extra.icon;
  var oldPath = config.uploads.oil.temp.dest + icon;
  var newPath = config.uploads.oil.iconImage.dest + icon;
  console.log(oil);


  var resolve = function(){
    oil.icon = (icon)? newPath: oil.icon;
    oil.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(oil);
      }
    });
  };
  var reject = function(err){
    return res.status(400).send({
      message: err
    });
  };

  return copyfile(oldPath,newPath,resolve,reject);
};

var copyfile = function(oldPath, newPath, resolve, error){
  fs.move(oldPath, newPath, function (err) {
    console.log("ERROR:\n\n" + err);
    if (err) {
      error(err);
    }else {
      resolve();
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
 * Update a article
 */
exports.update = function (req, res) {
  var oil = req.oil;

  oil.title = req.body.title;
  oil.content = req.body.content;
  oil.companyId = req.body.companyId;

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
 * Delete an article
 */
exports.delete = function (req, res) {
  var oil = req.oil;

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
