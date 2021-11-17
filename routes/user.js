const express = require('express');
const catchAsync=require('../util/catchAsync');
const AppError=require('../util/AppError');
const campground=require('../models/campground');
const Review=require('../models/review');
const user=require('../models/user');
const router=express.Router({mergeParams:true});
const joischema =require('../joischema');
const passlocalmong=require('passport-local-mongoose');
const passport=require('passport');
const validatecamp =(req,res,next)=>{
	const {error}=joischema.validate(req.body);
	//console.log(req.body,error)
	if(error){
		throw new AppError(error.message,400);
	}else{
		next();
	}
}
router.get('/register',(req,res,next)=>{
	res.render('register');
});
router.post('/register',catchAsync(async(req,res,next)=>{
	try{
		const {username,password,email}=req.body.register;
		const User=new user({email,username});
		const registeruser=await user.register(User,password);
		req.flash('success','Welcome to Yelp-Camp');
		return res.redirect('/campgrounds');
	}
	catch(e){
		req.flash('error',e.message)
		return res.redirect('/register');
	}
}));
module.exports=router;