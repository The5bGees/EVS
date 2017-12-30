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
 * Oil Schema
 */
var oilSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  botanical: {
    type: String,
    required: true
  },
  compound: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  reports: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: '/modules/oils/client/img/default-images/oil.png'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created_at: Date,
  updated_at: Date
});

oilSchema.pre('save', function (next) {
  var currentTime = new Date;
  this.updated_at = currentTime;
  if (!this.created_at) {
    this.created_at = currentTime;
  }
  next();
});

var Oil = mongoose.model('Oil', oilSchema);

module.exports = Oil;
