'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Listing Schema
 */
var companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reports: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: '/modules/companies/client/img/default-images/company.png'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created_at: Date,
  updated_at: Date
});

companySchema.pre('save', function (next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if (!this.created_at) {
    this.created_at = currentTime;
  }
  next();
});

var Company = mongoose.model('Company', companySchema);

module.exports = Company;
