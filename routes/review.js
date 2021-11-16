const express = require('express');
const catchAsync=require('../util/catchAsync');
const AppError=require('../util/AppError');
const campground=require('../models/campground');
const Review=require('../models/review');
const router=express.Router({mergeParams:true});
const joischema =require('../joischema');
const validatecamp =(req,res,next)=>{
	const {error}=joischema.validate(req.body);
	//console.log(req.body,error)
	if(error){
		throw new AppError(error.message,400);
	}else{
		next();
	}
}
router.delete('/:id/camp/:id1', catchAsync(async(req,res)=>{
	//console.log(req.params);
	const {id,id1}=req.params;
	await Review.findByIdAndDelete(id)
	.then((campgrounds)=>{
		req.flash('success','Successfuly DELETED the Review');
		res.redirect('/campgrounds/'+id1);
	})
	.catch((error)=>{
		req.flash('error','Could NOT DELETE the Review!');
		res.redirect('/campgrounds/'+id1);
	})
	
}));
module.exports=router;