'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Report = mongoose.model('Report'),
  Oil = mongoose.model('Oil'),
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
 * Create a Report
 */
exports.create = function (req, res) {
  var report = new Report(req.body);
  report.user = req.user;

  Company.findOne({ name: report.company }, function (err, company) {
    if (err) {
      // do nothing
    } else {
      report.website = company.url;
      report.save(function (err) {
        if (err) {
          console.log(err);
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(report);
          company.reports = company.reports + 1;
          company.save(function (err) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
          });
        }
      });
    }
  });
  Oil.findOne({ name: report.oil }, function (err, oil) {
    if (err) {
      // do nothing
    } else {
      oil.reports = oil.reports + 1;
      oil.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
    }
  });
};

/**
 * Show the current report
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var report = req.report ? req.report.toJSON() : {};

  // Add a custom field to the report, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the report model.
  report.isCurrentUserOwner = !!(report.user && report.user && report.user._id.toString() === req.user._id.toString());

  res.json(report);
};

/**
 * Update a report
 */
exports.update = function (req, res) {
  var report = req.report;

  report.oil = req.body.oil;
  report.company = req.body.company;
  report.batch = req.body.batch;
  report.country = req.body.country;
  report.date = req.body.date;
  report.simplePdf = req.body.simplePdf;
  report.result = req.body.result;
  report.resultColor = req.body.resultColor;

  Report.findOne({ _id: report._id }, function (err, rep) {
    if (err) {
      throw err;
    } else {
      if (rep.oil.toString() !== report.oil.toString()) {
        Oil.findOne({ name: report.oil }, function (err, oil) {
          if (err) {
            // do nothing
          } else {
            console.log('FOUND NEW OIL!');
            oil.reports = oil.reports + 1;
            oil.save(function (err) {
              if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }
            });
          }
        });
        Oil.findOne({ name: rep.oil }, function (err, oil) {
          if (err) {
            // do nothing
          } else {
            console.log('FOUND OLD OIL!');
            oil.reports = oil.reports - 1;
            oil.save(function (err) {
              if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }
            });
          }
        });
      }
      if (rep.company.toString() !== report.company.toString()) {
        Company.findOne({ name: report.company }, function (err, company) {
          if (err) {
            // do nothing
          } else {
            console.log('FOUND NEW COMPANY!');
            company.reports = company.reports + 1;
            company.save(function (err) {
              if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }
            });
          }
        });
        Company.findOne({ name: rep.company }, function (err, company) {
          if (err) {
            // do nothing
          } else {
            console.log('FOUND OLD COMPANY!');
            company.reports = company.reports - 1;
            company.save(function (err) {
              if (err) {
                return res.status(422).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }
            });
          }
        });
      }
    }
  });

  Company.findOne({ name: report.company }, function (err, company) {
    if (err) {
      // do nothing
    } else {
      report.website = company.url;
      report.save(function (err) {
        if (err) {
          console.log(err);
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(report);
        }
      });
    }
  });
};

exports.uploadPdf = function (req, res) {
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
    multerConfig = config.uploads.report.simplePdf;
  }

  var upload = multer(multerConfig).single('pdf');
  uploadFile()
    .then(function (r) {
      return res.status(200).send(r);
    })
    .catch(function (err) {
      res.status(422).send(err);
    });

  function uploadFile() {
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
          } else {
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
 * Delete a report
 */
exports.delete = function (req, res) {
  var report = req.report;

  report.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(report);
    }
  });
  Oil.findOne({ name: report.oil }, function (err, oil) {
    if (err) {
      // do nothing
    } else {
      oil.reports = oil.reports - 1;
      oil.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
    }
  });
  Company.findOne({ name: report.company }, function (err, company) {
    if (err) {
      // do nothing
    } else {
      company.reports = company.reports - 1;
      company.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
    }
  });
};

/**
 * List of Reports
 */
exports.list = function (req, res) {
  Report.find().sort('-created').populate('user', 'displayName').exec(function (err, reports) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reports);
    }
  });
};

/**
 * Article middleware
 */
exports.reportByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Report is invalid'
    });
  }

  Report.findById(id).populate('user', 'displayName').exec(function (err, report) {
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
