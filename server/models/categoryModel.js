const { Router } = require('express');
const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema(
    {
        name:{
            required:[true,'Please Enter A Category Name'],
            type:String,
            maxlength:100
        },
        description:{
            required:true,
            type:String
        },
        createdAt:{
            type:Date,
            default:Date.now,
        }
    
    },
    {timestamps:true}
    
);

module.exports = mongoose.model('Category',categorySchema)