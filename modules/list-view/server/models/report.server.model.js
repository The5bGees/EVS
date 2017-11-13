'use strict';

/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
let ReportSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  //TODO: put it back
  // date_tested: {
  //   type: Date,
  //   required: 'Require date tested'
  // },
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
      default: "NA"
    }
    // ,botanical_name : {
    //   type: Schema.botanical_name
    //   ref: 'Oil'
    // }
  }
  // company : {
  //   id : {
  //     type : Schema.ObjectId,
  //     ref: 'Company'
  //   },
  //   name: {
  //     type: Schema.name,
  //     ref: 'Company'
  //   }
  // },
});

// ReportSchema.pre('findOneAndUpdate', function(next,req,callback){
//   next();
// });
//pre-> is before
//post-> after
//this._doc contains
/***
 * Schema Save Middleware
 *
 * Before saving to the DB add the id to its Oil, to keep the reference
 */
ReportSchema.pre('save', function (next, req, callback) {
  let Oil = mongoose.model('Oil');
  let self = this._doc;

  let Report = mongoose.model('Report');
  let oldReport;

  Report.findOne({_id: this._doc._id})
    .then((res) => {
      oldReport = res;
      if (isOilNameDifferent(this._doc, oldReport)) {
        reduceOilReport(oldReport)
          .then(incrementOilReport(this._doc))
          .then(next())
          .catch((err)=>{
            //TODO: what to do with error
            console.log("ERROR");
            next();
          });
      }else {
        next();
      }
    })
    .catch((err) =>{
      incrementOilReport(this._doc)
        .then(next());
    });

  // Oil.findOne({name: self.oil.name}, function (err, oil) {
  //
  //   if (!err && oil) {
  //     oil.reports += 1;
  //
  //     Oil.findOneAndUpdate({name: self.oil.name},
  //       {reports: oil.reports},
  //       function (err) {
  //         if (err) {
  //           next();
  //         }
  //         else {
  //           self.oil.id = oil._id;
  //           next();
  //         }
  //       });
  //   } else {
  //     next();
  //   }
  // });

  //Return true if is the oil name is different in the reports
  let isOilNameDifferent = (newReport, oldReport) => {
    return newReport.oil.name !== oldReport.oil.name;
  };

  let reduceOilReport = (oldReport) => {
    return new Promise(function (resolve, reject) {
      Oil.findOne({name: oldReport.oil.name})
        .then((oil) => {
          if(oil == null){
            return reject("Oil doesn't exist");
          }
          console.log("reduce");
          console.log(oil);
          if (oil.reports === 0) {
            return resolve();
          }
          oil.reports -= 1;
          Oil.findOneAndUpdate({name: oldReport.oil.name},
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
    return new Promise(function (resolve, reject) {
      Oil.findOne({name: newReport.oil.name})
        .then((oil) => {
          console.log(oil);
          if(oil == null){
            return reject("Oil doesn't exist");
          }
          console.log("increment");
          console.log(oil);
          oil.reports += 1;
          Oil.findOneAndUpdate({name: oldReport.oil.name},
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
  }
});

// ReportSchema.pre('findOneAndUpdate', function (next, req, callback) {
//   let Oil = mongoose.model('Oil');
//   let self = this._doc;
//   this._update
//
//   Oil.findOne({name: self.oil.name}, function (err, oil) {
//
//     if (!err && oil) {
//       oil.reports.push(self._id);
//
//       Oil.findOneAndUpdate({name: self.oil.name},
//         {reports: oil.reports},
//         function (err) {
//             next();
//         });
//     } else {
//       next();
//     }
//   })
// });

mongoose.model('Report', ReportSchema);
