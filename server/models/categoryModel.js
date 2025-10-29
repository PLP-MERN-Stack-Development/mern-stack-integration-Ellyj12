const { Router } = require('express');
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
      unique: true,   
    },
    description: {
      type: String,
    },
  },
  { timestamps: true } // auto creates createdAt and updatedAt
);

module.exports = mongoose.model('Category', categorySchema);
