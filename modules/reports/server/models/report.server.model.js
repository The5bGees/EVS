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
 * Report Schema
 */
var reportSchema = new Schema({
  oil: {
    type: String
  },
  company: {
    type: String
  },
  batch: {
    type: String
  },
  country: {
    type: String
  },
  date: {
    type: String
  },
  result: {
    type: String
  },
  resultColor: {
    type: String
  },
  website: {
    type: String,
    default: ''
  },
  simplePdfPath: {
    type: String
  },
  simplePdfName: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created_at: Date,
  updated_at: Date
});

reportSchema.pre('save', function (next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if (!this.created_at) {
    this.created_at = currentTime;
  }
  next();
});

var Report = mongoose.model('Report', reportSchema);

module.exports = Report;
