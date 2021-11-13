const express = require('express');
const app=express();
const path=require('path');
const ejsmate=require('ejs-mate');
const catchAsync=require('./util/catchAsync');
const AppError=require('./util/AppError');
const mongoose=require('mongoose');
const session= require('express-session');
const campground=require('./models/campground');
const camproute=require('./routes/campground');
const revroute=require('./routes/review');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
app.engine('ejs',ejsmate)
app.use(express.urlencoded({extended: true}));
const methodOverride=require('method-override');
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.get('/',(req,res)=>{
	res.render('home.ejs')
});

app.use('/campgrounds',camproute);
app.use('/review',revroute);
const sessionconfig={
	secret: 'bibichod',
	resave: false,
	saveUninitialized: true,
	cookie:{
		httpOnly: true,
		expire: 100000000000,
		maxAge: 1000000000000
	}
};
app.use(session(sessionconfig));
app.get('/makecampground', catchAsync(async (req,res)=>{
	const camp = new  campground({title:'vhjvgfdhjsbfvs', location:'nbvxgdn'});
	await camp.save();
	res.send(camp);
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