const { Router } = require('express');
const mongoose = require('mongoose');
const slugify = require('slugify');


const PostSchema = new mongoose.Schema(
    {
        title:{
            type : String,
        },
        author:{
          
            type : String
        },
        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        content:{
           
            type : String
        },
        excerpt:{
            type: String ,
           
        },
        slug:{
            required:true,
            unique:true,
            type:String
        },
        tags:[String],

        isPublished:{
            type:Boolean,
            default:true
        },
    },
    {timestamps:true}
);
PostSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports=mongoose.model('Post',PostSchema)