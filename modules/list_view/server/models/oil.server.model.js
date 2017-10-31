'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var OilSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  botanicalName: {
    type: String,
    default: 'NA',
    trim: true,
  },
  reportNumber: {
    type: String,
    default: 0,
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  color:{
    type: [{
      type: String,
      enum: ['blue', 'red','orange','purple']
    }],
    default: ['blue']
  },
  companyId: {
    type: String,
    default: 'NA'
  },
  pdfUrlSample: {
    type: String,
    default: "",
    trim: true
  },
  pdfUrlFull: {
    type: String,
    default: "",
    trim: true
  },
  icon: {
    type: String,
    default: ""
  }
});

mongoose.model('Oil', OilSchema);
