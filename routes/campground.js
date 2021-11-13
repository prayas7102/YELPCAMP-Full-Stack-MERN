const express = require('express');
const app=express();
const catchAsync=require('../util/catchAsync');
const AppError=require('../util/AppError');
const campground=require('../models/campground');
const Review=require('../models/review');
const router=express.Router();
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
router.get('/', catchAsync(async(req,res)=>{
	const campgrounds= await campground.find({});
	//console.log(campgrounds);
	res.render('campgrounds/app',{campgrounds});
} ));
router.get('/new',(req,res)=>{
	res.render('campgrounds/new');
});
router.post('/',validatecamp, catchAsync(async(req,res)=>{
	//if(!req.body.campground) throw new AppError('invalid campground',400);
	const campgrounds= new campground(req.body.campground);
	await campgrounds.save();
	res.redirect('/campgrounds/'+campgrounds._id);
}));

router.get('/:id', catchAsync(async(req,res)=>{
	const campgrounds = await campground.findById(req.params.id).populate('reviews');
	//console.log(campgrounds);
	res.render('campgrounds/show',{campgrounds});
}));
router.get('/:id/edit', catchAsync(async(req,res)=>{
	const campgrounds = await campground.findById(req.params.id);
	//console.log(req.params);
	res.render('campgrounds/edit',{campgrounds});
}));

router.put('/:id',validatecamp, catchAsync(async(req,res)=>{
	const {id}=req.params;
    console.log(id);
	const campgrounds=await campground.findByIdAndUpdate(id,{...req.body.campgrounds});
//	console.log(req.body);
	res.redirect('/campgrounds/'+campgrounds._id);
}));
router.delete('/:id', catchAsync(async(req,res)=>{
	//console.log('h');
	const {id}=req.params;
	await campground.findByIdAndDelete(id);
	res.redirect('/campgrounds');
}));
router.post('/:id/review',catchAsync(async(req,res)=>{
	const camp = await campground.findById(req.params.id);
	//console.log(camp);
	const review = new Review(req.body.review);
	camp.reviews.push(review);
	await review.save();
	await camp.save();
	res.redirect("/campgrounds/"+camp._id);
}));
module.exports=router;