'use strict';
//TODO jorge: need to be fix
/**
 * Module dependencies.
 */
let path = require('path'),
  mongoose = require('mongoose'),
  Report = mongoose.model('Report'),
  multer = require('multer'),
  // aws = require('aws-sdk'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  fs = require('fs'),
  reportConfig = config.uploads.report;

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


/**
 * Upload pdf files
 */
exports.uploadSimplifyPdf = function (req, res) {
  let fileInfo = reportConfig.simplify_pdf;
  let singleName = 'pdf';

  uploadFile(fileInfo, singleName, req, res)
    .then(function (r) {

      return res.status(200).send(r);
    }).catch(function (err) {
    return res.status(422).send(err);
  })
};

/**
 * Upload pdf files
 */
exports.uploadExtendedPdf = function (req, res) {
  let fileInfo = reportConfig.extended_pdf;
  let singleName = 'pdf';

  uploadFile(fileInfo, singleName, req, res)
    .then(function (r) {

      return res.status(200).send(r);
    }).catch(function (err) {
    return res.status(422).send(err);
  })
};


/**
 * send pdf to client
 */
//TODO: FINISH THIS ONE
exports.getPdf = function (req, res) {
  let fileName = req.query.pdfUrl;
  console.log(fileName);

  fs.readFile(fileName, function(err,data){
    if (err) {
      return res.status(404).send(err);
    }
    console.log(data);
    res.send(new Buffer(data, 'binary'));

    // res.writeHead(200, {
    //   'Content-Type': 'application/pdf',
    //   'Content-Disposition': 'attachment; filename=some_file.pdf',
    //   'Content-Length': data.length
    // });
    //
    // res.on('data', function(data) {
    //   res.write(data);
    // });
    //
    // res.on('end',function(){
    //   res.end();
    // });
  });
  // let stat = fs.statSync(fileName);
  // res.setHeader('Content-Length', stat.size);
  // res.setHeader('Content-Type', 'application/pdf');
  // res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  //
  // stream.pipe(res);



  // res.sednfile(req.query.pdf.Url);
  // res.send(418);
  // res.writeHead(200, {
  //   'Content-Type': mimetype,
  //   'Content-disposition': 'attachment;filename=' + filename,
  //   'Content-Length': data.length
  // });
  // res.end(new Buffer(data, 'binary'));
};

/**
 * Create a Report
 */
exports.create = function (req, res) {
  let report = new Report(req.body);
  report.user = req.user;
  report.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      return res.json(report);
    }
  });
};

/**
 * Show the current Report
 */
exports.read = function (req, res) {
  res.json(req.report);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
  let report = req.report;

  report.name = req.body.name;
  report.description = req.body.description;
  report.country_of_origin = req.body.country_of_origin;
  report.result = req.body.result;
  report.simplify_pdf = req.body.simplify_pdf;
  report.extended_pdf = req.body.extended_pdf;
  report.oil.name = req.body.oil.name;
  report.date_tested = req.body.date_tested;

  report.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(report);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  let report = req.report;

  report.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(report);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Report.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
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
 * Report middleware
 */
exports.reportByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Report is invalid'
    });
  }

  Report.findById(id).exec(function (err, report) {
    if (err) {
      return next(err);
    } else if (!report) {
      return res.status(404).send({
        message: 'No report with that identifier has been found'
      });
    }
    req.report = report;
    next();
  });
};
