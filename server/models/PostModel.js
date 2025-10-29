const { Router } = require('express');
const mongoose = require('mongoose');
const slugify = require('slugify');


const PostSchema = new mongoose.Schema(
    {
        title:{
            required:true,
            type : String,
            maxlength:[20,'Title can not be more than 20 characters']
        },
        author:{
            required:[true,'Author cannot be empty'],
            type : String
        },
        // category:{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Category',
        //     required: true,
        // },
        content:{
            required:[true,'Please provide content'],
            type : String
        },
        excerpt:{
            type: String ,
            maxlength:[100,'Excerpt cant be more than 100 characters']
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