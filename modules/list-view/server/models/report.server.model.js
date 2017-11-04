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
    required: 'Title cannot be blank'
  },
  date_tested: {
    type: Date,
    required: 'Require date tested'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  icon: {
    type: String,
    trim: true,
    default: ""
  },
  country_of_origin : {
    type : String,
    trim: true,
    default: ""
  },
  result : {
    type : String,
    trim: true,
    default : "NA"
  },
  simplify_pdf : {
    type : String,
    trim: true,
    default : "NA"
  },
  extended_pdf : {
    type : String,
    trim: true,
    default : "NA"
  },
  oil : {
    id : {
      type : Schema.ObjectId,
      ref: 'Oil'
    },
    name: {
      type: String,
      trim: true,
      default : "NA"
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

// TODO: do before saving change schema
// ReportSchema.pre('findOneAndUpdate', function(next,req,callback){
//   next();
// });

mongoose.model('Report', ReportSchema);
