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
 * Upload Icon
 */
// //TODO: set JSCS to use async await
// exports.uploadAll = function (req, res) {
//   var icon = null;
//   var pdf = null;
//
//   console.log("HERE");
//
//   var iconInfo = config.uploads.oil.iconImage;
//   var iconSingleName = 'iconImage';
//
//   var pdfInfo = config.uploads.oil.pdf;
//   var pdfSingleName = 'pdf';
//
//   uploadFile(iconInfo, iconSingleName, req, res)
//     .then(function(r){
//       icon = r.file;
//       console.log(icon);
//       return uploadFile(pdfInfo, pdfSingleName, req, res);
//     }).then(function(res){
//       pdf = res.file;
//       console.log("HERE2");
//       console.log(pdf);
//
//       return res.status(200).send({
//         message: "All good",
//         iconFile: icon,
//         pdfFile: pdf
//       });
//   }).catch(function(err){
//     if(!icon){
//       //TODO: remove file
//     }
//     console.log("ERROR");
//     return res.status(400).send(err.body);
//   });
// };

var uploadFile = function (fileInfo, singleName, req, res) {
  var upload = multer(fileInfo).single(singleName);
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
          message: 'All good',
          file: req.file
        });
      }
    });
  });
};

exports.uploadIcon = function (req, res) {
  var fileInfo = config.uploads.oil.iconImage;
  var singleName = 'iconImage';

  uploadFile(fileInfo,singleName,req,res)
    .then(function(r){
      return res.status(200).send(r);
    }).catch(function(err){
      return res.status(400).send(err);
  })
};

exports.uploadPdf = function (req, res) {
  var fileInfo = config.uploads.oil.pdf;
  var singleName = 'pdf';

  uploadFile(fileInfo,singleName,req,res)
    .then(function(r){

      return res.status(200).send(r);
    }).catch(function(err){
    return res.status(400).send(err);
  })
};
//
// exports.uploadIcon = function (req, res) {
//   var fileInfo = config.uploads.oil.iconImage;
//   var upload = multer(fileInfo).single('iconImage');
//
//   upload(req, res, function (uploadError) {
//     if (uploadError) {
//       return res.status(400).send({
//         message: 'Error occurred while uploading Oil Icon image'
//       });
//     } else {
//       if (!req.file) {
//         return res.status(400).send({
//           message: 'Error saving file'
//         });
//       }
//       return res.send({
//         message: 'All good',
//         file: req.file
//       });
//     }
//   });
// };
//
//

/**
 * Create a Oil
 */
exports.create = function (req, res) {
  var oil = new Oil(req.body);
  //TODO: remove console
  console.log("Creating New Oil");
  console.log(req.body);
  oil.user = req.user;
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
