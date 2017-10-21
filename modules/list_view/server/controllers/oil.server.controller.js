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
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Update icon
 */
exports.changeIcon = function(req,res){
  var oil = req.oil;
  var upload = multer(config.uploads.oil);

  if(oil){
    upload(req,res,function(uploadError){
      if(uploadError){
        return res.status(400).send({
          message: 'Error occurred while uploading Oil Icon image'
        });
      }else {
        oil.icon = config.uploads.oil.dest + req.file.filename;

        oil.save(function(err){
          if(err) {
            return res.status(400).send({
              message: 'Error occurred while uploading oil icon image'
            });
          }else {
            //TODO: functionality when icon is change
              // update front-end
          }
        })
      }
    });
  }else {
    res.status(400).send({
      message: 'Error no oil'
    })
  }
};


/**
 * Create a Oil
 */
exports.create = function (req, res) {
    var oil = new Oil(req.body);
    oil.user = req.user;

    console.log(JSON.stringify(req.body,null,2));

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
