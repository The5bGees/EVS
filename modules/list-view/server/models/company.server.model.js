'use strict';

/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
let CompanySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    trim: true,
    unique: 'Company Name already exists',
    required: 'Title cannot be blank'
  },
  last_report_date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  reports: {
    type: Number,
    default: 0
  },
  //EXTRA
  color:{
    type: [{
      type: String,
      enum: ['blue', 'red','orange','purple','green','yellow']
    }],
    default: ['blue']
  },
  //URL for image
  icon: {
    type: String,
    default: ""
  }
});

mongoose.model('Company', CompanySchema);
