const express = require('express');
const catchAsync=require('../util/catchAsync');
const AppError=require('../util/AppError');
const campground=require('../models/campground');
const Review=require('../models/review');
const router=express.Router();
const joischema =require('../joischema');
const islogin = require('../loggedin');
const validatecamp =(req,res,next)=>{
	const {error}=joischema.validate(req.body);
	//console.log(req.body,error)
	if(error){
		throw new AppError(error.message,400);
	}else{
		next();
	}
}
router.get('/', catchAsync(async(req,res)=>{
	const campgrounds= await campground.find({});
	//console.log(campgrounds);
	res.render('campgrounds/app',{campgrounds});
} ));
router.get('/new',islogin,(req,res)=>{
	res.render('campgrounds/new');
});
router.post('/',validatecamp, catchAsync(async(req,res)=>{
	//if(!req.body.campground) throw new AppError('invalid campground',400);
	const campgrounds= new campground(req.body.campground);
	if(!campgrounds){
		req.error('error','Successfuly DID NOT made a new Campground');
	}else{
		req.flash('success','Successfuly made a new Campground');
		campgrounds.author=req.user._id;
		await campgrounds.save();
	}	
	res.redirect('/campgrounds/'+campgrounds._id);
}));

router.get('/:id', catchAsync(async(req,res)=>{
	//console.log(req.params.id);
	const campgrounds = await campground.findById(req.params.id).populate({path:'reviews',populate:{path:'person'}}).populate('author')
	.then((campgrounds)=>{
	//	console.log(campgrounds);
		req.flash('success','Successfuly found Campground');
		res.render('campgrounds/show',{campgrounds});
	})
	.catch((a)=>{
		//console.log(a);
		req.flash('error','DID NOT found Campground');
		res.redirect('/campgrounds');
	})
	
}));
router.get('/:id/edit',islogin, catchAsync(async(req,res)=>{
	const campgrounds = await campground.findById(req.params.id)
	.then((campgrounds)=>{
		req.flash('success','EDIT the Campground');
		res.render('campgrounds/edit',{campgrounds});
	})
	.catch((error)=>{
		req.flash('error','Could NOT open the EDIT page!');
		res.redirect('/campgrounds/'+req.params.id);
	})
}));

router.put('/:id',validatecamp, catchAsync(async(req,res)=>{
	const {id}=req.params;
	const campgrounds=await campground.findByIdAndUpdate(id,{...req.body.campgrounds})
	.then((campgrounds)=>{
		req.flash('success','Successfuly EDITED the Campground');
		res.redirect('/campgrounds/'+campgrounds._id);
	})
	.catch((error)=>{
		req.flash('error','Could NOT EDIT the Campground!');
		res.redirect('/campgrounds/'+req.params.id);
	})
}));
router.delete('/:id' ,islogin, catchAsync(async(req,res)=>{
	const {id}=req.params;
	await campground.findByIdAndDelete(id)
	.then((campgrounds)=>{
		req.flash('success','Successfuly DELETED the Campground');
		res.redirect('/campgrounds');
	})
	.catch((error)=>{
		req.flash('error','Could NOT DELETE the Campground!');
		res.redirect('/campgrounds');
	})
	
}));
router.post('/:id/review',catchAsync(async(req,res)=>{
	const camp = await campground.findById(req.params.id).populate({path:'reviews',populate:{path:'person'}}).populate('author');
	console.log(camp)
	const review = new Review(req.body.review);
	review.person=req.user._id;
	camp.reviews.push(review);
	await review.save();
	await camp.save().then((campgrounds)=>{
		req.flash('success','Successfuly ADDED the Review');
		// campgrounds.populate('reviews');
		//console.log(campgrounds);
		res.redirect("/campgrounds/"+camp._id);
	})
	.catch((error)=>{
		req.flash('error','Could NOT DELETE the Review!');
		res.redirect("/campgrounds/"+camp._id);
	})
	
}));
module.exports=router;