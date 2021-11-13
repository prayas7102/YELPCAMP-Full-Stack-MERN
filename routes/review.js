const express = require('express');
const app=express();
const catchAsync=require('../util/catchAsync');
const AppError=require('../util/AppError');
const campground=require('../models/campground');
const Review=require('../models/review');
const router=express.Router({mergeParams:true});
const path=require('path');
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
const methodOverride=require('method-override');
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
router.delete('/:id/camp/:id1', catchAsync(async(req,res)=>{
	//console.log(req.params);
	const {id,id1}=req.params;
	await Review.findByIdAndDelete(id);
	res.redirect('/campgrounds/'+id1);
}));
module.exports=router;