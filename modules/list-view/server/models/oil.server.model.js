'use strict';

/**
 * Module dependencies.
 */
let mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
let OilSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    trim: true,
    unique: 'Oil Name already exists',
    required: 'Name cannot be blank'
  },
  botanical_name: {
    type: String,
    default: 'NA',
    trim: true,
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
    default: "modules/list-view/client/img/default-images/oil.png"
  }
});


mongoose.model('Oil', OilSchema);
