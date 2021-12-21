const express = require('express');
const catchAsync=require('../util/catchAsync');
const AppError=require('../util/AppError');
const campground=require('../models/campground');
const Review=require('../models/review');
const router=express.Router();
const joischema =require('../joischema');
const islogin = require('../loggedin');
const multer=require('multer');
const {cloudinary,storage}=require('../cloudinary/cloud');
const upload=multer({storage});
const geocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxtoken=process.env.MAPBOX_TOKEN;
const geocoder=geocoding({accessToken:mapboxtoken});
const validatecamp =(req,res,next)=>{
	const {error}=joischema.validate(req.body);
	//console.log(req.body,error)
	if(error){
		throw new AppError(error.message,400);
	}else{
		next();
	}
}
router.route('/')
.get(catchAsync(async(req,res)=>{
	const campgrounds= await campground.find({});
	// console.log(campgrounds);
	res.render('campgrounds/app',{campgrounds});
} ))
.post(upload.array('image'),validatecamp,catchAsync(async(req,res)=>{
	console.log(req.body.campground.location);
	const geodata= await geocoder.forwardGeocode({
		query:req.body.campground.location,limit:10
	}).send();
	// res.send(geodata.body.features[0].geometery.coordinates);
	const campgrounds= new campground(req.body.campground);
	campgrounds.image=req.files.map(f=>({url:f.path,filename:f.filename}));
	if(!campgrounds){
		req.error('error','Successfuly DID NOT made a new Campground');0
	}else{
		req.flash('success','Successfuly made a new Campground');
		campgrounds.geometry=geodata.body.features[0].geometry;
		campgrounds.author=req.user._id;
		await campgrounds.save();
	}	
	res.redirect('/campgrounds/'+campgrounds._id);
}));

router.get('/new',islogin,(req,res)=>{
	res.render('campgrounds/new');
});

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
router.route('/:id')
	.get( catchAsync(async(req,res)=>{
	const campgrounds = await campground.findById(req.params.id).populate({path:'reviews',populate:{path:'person'}}).populate('author')
	.then((campgrounds)=>{
		req.flash('success','Successfuly found Campground');
		res.render('campgrounds/show',{campgrounds});
	})
	.catch((a)=>{
		console.log(a);
		req.flash('error','DID NOT found Campground');
		res.redirect('/campgrounds');
	})
	
}))
	.put(upload.array('image'),validatecamp, catchAsync(async(req,res)=>{
	const {id}=req.params;
	const campgrounds=await campground.findByIdAndUpdate(id,{...req.body.campgrounds})
	.then(async(campgrounds)=>{
		req.files.map(f=>(campgrounds.image.push({url:f.path,filename:f.filename})));
		await campgrounds.save();
		if(req.body.delete){
			for(let filename of req.body.delete){
				 await cloudinary.uploader.destroy(filename);
			}
		   await campgrounds.updateOne({$pull:{image:{filename:{$in: req.body.delete}}}});
		} 
		await campgrounds.save();
		req.flash('success','Successfuly EDITED the Campground');
		res.redirect('/campgrounds/'+campgrounds._id);
	})
	.catch((error)=>{
		console.log(error);
		req.flash('error','Could NOT EDIT the Campground!');
		res.redirect('/campgrounds/'+req.params.id);
	})
}))
	.delete(islogin, catchAsync(async(req,res)=>{
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
	
}))
router.post('/:id/review',catchAsync(async(req,res)=>{
	const camp = await campground.findById(req.params.id).populate({path:'reviews',populate:{path:'person'}}).populate('author');
	
	const review = new Review(req.body.review);
	review.person=req.user._id;
	camp.reviews.push(review);
	console.log(camp);
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