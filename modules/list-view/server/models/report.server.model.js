'use strict';

/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Report Schema
 */
let ReportSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  //bash number
  name: {
    type: String,
    trim: true,
    unique: 'Company Name already exists',
    required: 'Name cannot be blank'
  },
  date_tested: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  // icon: {
  //   type: String,
  //   trim: true,
  //   default: ""
  // },
  country_of_origin: {
    type: String,
    trim: true,
    default: ""
  },
  result: {
    type: String,
    trim: true,
    default: "NA"
  },
  simplify_pdf: {
    type: String,
    trim: true,
    default: "NA"
  },
  extended_pdf: {
    type: String,
    trim: true,
    default: "NA"
  },
  oil: {
    name: {
      type: String,
      trim: true,
      default: "NA",
      required: 'Oil cannot be blank'
    }
  },
  company: {
    name: {
      type: String,
      trim: true,
      default: "NA",
      required: 'Company cannot be blank'
    }
  }
});


// ReportSchema.pre('findOneAndUpdate', function(next,req,callback){
//   next();
// });
//pre-> is before
//post-> after
//this._doc contains the new report
/***
 * Schema Save Middleware
 *
 * Before saving to the DB add the id to its Oil, to keep the reference
 */
ReportSchema.pre('save', async function (next, req, callback) {
  let Report = mongoose.model('Report');
  try {
    let oldReport = await Report.findOne({_id: this._doc._id});

    if (oldReport) {
      if (isOilNameDifferent(this._doc, oldReport)) {
        await reduceOilReport(oldReport);
      }
      if (isCompanyNameDifferent(this._doc, oldReport)) {
        await reduceCompanyReport(oldReport);
      }
    }

    await incrementOilReport(this._doc);
    await  incrementCompanyReport(this._doc);

    next();
  }catch(err){
    next(err);
  }
});

ReportSchema.pre('remove', async function (next, req, callback) {
  try {
    await reduceOilReport(this._doc);
    await reduceCompanyReport(this._doc);

    next();
  }catch (err){
    next(err);
  }
});

//Return true if is the oil name is different in the report
let isOilNameDifferent = (newReport, oldReport) => {
  return newReport.oil.name !== oldReport.oil.name;
};

//Return true if is the Company name is different in the report
let isCompanyNameDifferent = (newReport, oldReport) => {
  return newReport.company.name !== oldReport.company.name;
};

//Oil
let reduceOilReport = (oldReport) => {
  let Oil = mongoose.model('Oil');

  return new Promise(function (resolve, reject) {
    Oil.findOne({name: oldReport.oil.name})
      .then((oil) => {
        if (!oil) {
          return resolve();
        }
        if (oil.reports === 0) {
          return resolve();
        }
        oil.reports -= 1;
        Oil.findOneAndUpdate({_id: oil._id},
          {reports: oil.reports},
          function (err) {
            if (err) {
              return reject(err);
            }
            else {
              return resolve();
            }
          });

      }).catch((err) => {
      return reject(err);
    })
  });
};

let incrementOilReport = (newReport) => {
  let Oil = mongoose.model('Oil');
  return new Promise(function (resolve, reject) {
    Oil.findOne({name: newReport.oil.name})
      .then((oil) => {
        if (!oil) {
          return reject("Oil doesn't exist");
        }
        oil.reports += 1;

        Oil.findOneAndUpdate({_id: oil._id},
          {reports: oil.reports},
          function (err) {
            if (err) {
              return reject(err);
            }
            else {
              return resolve();
            }
          });
      }).catch((err) => {
      return reject(err);
    })
  });
};

//Company
let reduceCompanyReport = (oldReport) => {
  let Company = mongoose.model('Company');

  return new Promise(function (resolve, reject) {
    Company.findOne({name: oldReport.company.name})
      .then((company) => {
        if (!company) {
          return resolve();
        }
        if (company.reports === 0) {
          return resolve();
        }
        company.reports -= 1;
        Company.findOneAndUpdate({_id: company._id},
          {reports: company.reports},
          function (err) {
            if (err) {
              return reject(err);
            }
            else {
              return resolve();
            }
          });

      }).catch((err) => {
      return reject(err);
    })
  });
};

let incrementCompanyReport = (newReport) => {
  let Company = mongoose.model('Company');
  return new Promise(function (resolve, reject) {

    Company.findOne({name: newReport.company.name})
      .then((company) => {
        if (!company) {
          return reject("Company doesn't exist");
        }
        company.reports += 1;

        Company.findOneAndUpdate({_id: company._id},
          {reports: company.reports},
          function (err) {
            if (err) {
              return reject(err);
            }
            else {
              return resolve();
            }
          });
      }).catch((err) => {
      return reject(err);
    })
  });
};

mongoose.model('Report', ReportSchema);
