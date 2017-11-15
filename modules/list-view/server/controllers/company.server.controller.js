'use strict';
//TODO might need to be fix
/**
 * Module dependencies.
 */
let path = require('path'),
  mongoose = require('mongoose'),
  Oil = mongoose.model('Oil'),
  multer = require('multer'),
  // aws = require('aws-sdk'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  fs = require('fs');

// let useS3Storage = config.uploads.storage === 's3' && config.aws.s3;
// let s3;
//
// if (useS3Storage) {
//   aws.config.update({
//     accessKeyId: config.aws.s3.accessKeyId,
//     secretAccessKey: config.aws.s3.secretAccessKey
//   });
//
//   s3 = new aws.S3();
// }


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
          message: 'All good',
          file: req.file
        });
      }
    });
  });
};

//TODO jorge: fix this
exports.deleteIcon = function(req, res){
  let iconName =  req.query.path;
  //TODO jorge: remove this
  console.log("HERE GOD DAMN IT");
  console.log(req.query);

  try {
    fs.unlinkSync(iconName);
    return res.status(200).send('icon deleted');

  }catch(err){
    console.log(err);
    return res.status(422)
      .send("Error: " + iconName + " file doesn't exist");
  }
};

/**
 * Upload Icon
 */
//TODO jorge: fix this
exports.uploadIcon = function (req, res) {
  let fileInfo = config.uploads.oil.iconImage;
  let singleName = 'iconImage';

  uploadFile(fileInfo, singleName, req, res)
    .then(function (r) {
      return res.status(200).send(r);
    }).catch(function (err) {
    return res.send({message: errorHandler.getErrorMessage(err)});
  })
};


/**
 * Upload pdf files
 */
// exports.uploadPdf = function (req, res) {
//   var fileInfo = config.uploads.oil.pdf;
//   var singleName = 'pdf';
//
//   uploadFile(fileInfo, singleName, req, res)
//     .then(function (r) {
//
//       return res.status(200).send(r);
//     }).catch(function (err) {
//     return res.status(422).send(err);
//   })
// };

/**
 * send pdf to client
 */
//TODO: FINISH THIS ONE
exports.getPdf = function (req, res) {
  // console.log("HERE");
  // console.log(req);
  // res.status(200).send();
  res.status(422).send();
};

/**
 * Create a Oil
 */
exports.create = function (req, res) {
  console.log(req.body);
  let oil = new Oil(req.body);
  oil.user = req.user;
  //TODO jorge: remove this
  console.log(oil);
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
 * Update a article
 */
//TODO jorge: update function
exports.update = function (req, res) {
  var oil = req.oil;

  oil.title = req.body.name;
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
