const express = require ('express');
const router = express.Router();
const Category = require('../models/categoryModel')
const asyncHandler = require('../utils/asyncHandler')

router.get('/', asyncHandler(async(req,res)=>{
    const catgeories = await Category.find()
    res.json(catgeories)
}))

router.post('/', asyncHandler(async(req,res)=>{
    const {name,description} = req.body

    const existingCategory = await Category.findOne({name})
    if(existingCategory){
        return res.status(400).json({
            message:'Category already exists'
        })
    }

    const newCategory = new Category({name,description})
    const savedCategory = await newCategory.save();

    res.status(201).json({
        message:'Category created succesfully ',
        category:savedCategory
    })
}))
module.exports = router
