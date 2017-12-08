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
    required: 'Company Name cannot be blank'
  },
  last_report_date: {
    type: Date,
    default: null
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  website: {
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
    type: String,
    default: 'Gray'
  },
  //URL for image
  icon: {
    type: String,
    default: "modules/list-view/client/img/default-images/company.png"
  },
  companyUrl: {
    type : String
  }
});

mongoose.model('Company', CompanySchema);
