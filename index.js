const express = require('express');
const app=express();
const path=require('path');
const methodOverride=require('method-override');
const ejsmate=require('ejs-mate');
const Joi=require('joi');
const joischema =require('./joischema');
const catchAsync=require('./util/catchAsync');
const AppError=require('./util/AppError');
const mongoose=require('mongoose');
const campground=require('./models/campground');
const Review=require('./models/review');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
app.engine('ejs',ejsmate)
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.get('/',(req,res)=>{
	res.render('home.ejs')
});
const validatecamp =(req,res,next)=>{
	const {error}=joischema.validate(req.body);
	//console.log(req.body,error)
	if(error){
		throw new AppError(error.message,400);
	}else{
		next();
	}
}
app.get('/makecampground', catchAsync(async (req,res)=>{
	const camp = new  campground({title:'vhjvgfdhjsbfvs', location:'nbvxgdn'});
	await camp.save();
	res.send(camp);
}));
app.get('/campgrounds/new',(req,res)=>{
	res.render('campgrounds/new');
});
app.post('/campgrounds',validatecamp, catchAsync(async(req,res)=>{
	//if(!req.body.campground) throw new AppError('invalid campground',400);
	const campgrounds= new campground(req.body.campground);
	await campgrounds.save();
	res.redirect('/campgrounds/'+campgrounds._id);
}));

app.get('/campgrounds/:id', catchAsync(async(req,res)=>{
	const campgrounds = await campground.findById(req.params.id).populate('reviews');
	//console.log(campgrounds);
	res.render('campgrounds/show',{campgrounds});
}));
app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
	const campgrounds = await campground.findById(req.params.id);
	//console.log(req.params);
	res.render('campgrounds/edit',{campgrounds});
}));
app.get('/campgrounds', catchAsync(async(req,res)=>{
	const campgrounds= await campground.find({});
	//console.log(campgrounds);
	res.render('campgrounds/app',{campgrounds});
} ));
app.put('/campgrounds/:id',validatecamp, catchAsync(async(req,res)=>{
	const {id}=req.params;
	const campgrounds=await campground.findByIdAndUpdate(id,{...req.body.campgrounds});
//	console.log(req.body);
	res.redirect('/campgrounds/'+campgrounds._id);
}));
app.delete('/campgrounds/:id', catchAsync(async(req,res)=>{
	//console.log('h');
	const {id}=req.params;
	await campground.findByIdAndDelete(id);
	res.redirect('/campgrounds');
}));
app.delete('/review/:id/camp/:id1', catchAsync(async(req,res)=>{
	//console.log(req.params);
	const {id,id1}=req.params;
	await Review.findByIdAndDelete(id);
	res.redirect('/campgrounds/'+id1);
}));
app.post('/campgrounds/:id/review',catchAsync(async(req,res)=>{
	const camp = await campground.findById(req.params.id);
	//console.log(camp);
	const review = new Review(req.body.review);
	camp.reviews.push(review);
	await review.save();
	await camp.save();
	res.redirect("/campgrounds/"+camp._id);
}));
app.all('*',(req,res,next)=>{
	next(new AppError('Page not found',404))
})
app.use((err,req,res,next)=>{
	const {statuscode=500,message="something went wrong"}=err;
	//console.log(err);
	res.status(statuscode).render('error',{err});
});
app.listen(3000,()=>{
	console.log('serving on port 3000')
})