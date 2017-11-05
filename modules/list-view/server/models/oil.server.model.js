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
    required: 'Title cannot be blank'
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
    type: [Schema.ObjectId],
    ref: 'Report'
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
// TODO: do before saving change schema
// OilSchema.pre('findOneAndUpdate', function(next,req,callback){
//   next();
// });

mongoose.model('Oil', OilSchema);
