// 'use strict';
//
// /**
//  * Module dependencies.
//  */
// var mongoose = require('mongoose'),
//   Schema = mongoose.Schema;
//
// /**
//  * Company Schema
//  */
// var CompanySchema = new Schema({
//   name: {
//     type: String,
//     default: '',
//     required: 'Please fill Company name',
//     trim: true
//   },
//   rating: {
//     type: String,
//     default: '',
//     required: 'Please fill Company rating',
//     trim: true
//   },
//   bodycompany: {
//     type: String,
//     default: '',
//     required: 'Please fill Company information',
//     trim: true
//   },
//   bodyoil: {
//     type: String,
//     default: '',
//     required: 'Please fill Company oil information',
//     trim: true
//   },
//   link: {
//     type: String,
//     default: '',
//     required: 'Please fill Company report link',
//     trim: true
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   },
//   user: {
//     type: Schema.ObjectId,
//     ref: 'User'
//   }
// });
//
// mongoose.model('Company', CompanySchema);
