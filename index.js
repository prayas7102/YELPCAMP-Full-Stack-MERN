if(process.env.NODE_ENV!=="production"){
	require('dotenv').config();
}
const express = require('express');
const app=express();
const path=require('path');
const ejsmate=require('ejs-mate');
const catchAsync=require('./util/catchAsync');
const AppError=require('./util/AppError');
const mongoose=require('mongoose');
const session= require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const localstrat=require('passport-local');
const user=require('./models/user');
const campground=require('./models/campground');
const camproute=require('./routes/campground');
const revroute=require('./routes/review');
const userRoute=require('./routes/user');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
app.engine('ejs',ejsmate)
app.use(express.urlencoded({extended: true}));
const methodOverride=require('method-override');
const { serializeUser } = require('passport');
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use((req,res,next)=>{
	res.locals.currentuser=req.user;
	next();
});
app.get('/home',(req,res)=>{
	return res.render('home');
});

const sessionconfig={
	secret: 'bibichod',
	resave: false,
	saveUninitialized: true,
	cookie:{
		httpOnly: true,
		expire: 1000000000000000000000000000000000999999999999999999999999999999999,
		maxAge: 1000000000000999999999999999999999999999999999999999999999999999999
	}
};
app.use(session(sessionconfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrat(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currentuser=req.user;
	res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
	next();
});

app.use('/campgrounds',camproute);
app.use('/review',revroute);
app.use('/',userRoute);
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
	next();
});
app.listen(3000,()=>{
	console.log('serving on port 3000')
})