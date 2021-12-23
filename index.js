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
const mongoSanitize = require('express-mongo-sanitize');
const passport=require('passport');
const localstrat=require('passport-local');
const user=require('./models/user');
const campground=require('./models/campground');
const camproute=require('./routes/campground');
const revroute=require('./routes/review');
const userRoute=require('./routes/user');
const helmet=require('helmet');
const MongoDBStore=require('connect-mongo');
const url=process.env.DB_URL;
// mongodb://localhost:27017/yelp-camp
mongoose.connect(url || 'mongodb://localhost:27017/yelp-camp',{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
app.engine('ejs',ejsmate);
app.use(mongoSanitize());
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
// const store = MongoDBStore.create({
// 	url: process.env.DB_URL , secret:"fckyou",touchAfter: 24*60*60
// })

const sessionconfig={
	// store: MongoDBStore.create({
	// 	mongoUrl: url ,
	// 	secret:"grfrbdh234",
	// 	ttl: 14 * 24 * 60 * 60 ,
	// 	touchAfter: 24*60*60, 
	//   }),
	name:'session',
	secret: '435746eGHVHGF892',
	resave: false,
	saveUninitialized: false,
	cookie:{
		httpOnly: true,
		// secure:true,
		expire: 100*1000*60,
		maxAge: 100*1000*60
	}
};
app.use(session(sessionconfig));
app.use(flash());
app.use(helmet({contentSecurityPolicy:false}));

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
app.get('/home',(req,res)=>{
	return res.render('home');
});
app.get('/',(req,res)=>{
	return res.render('home');
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
app.listen(process.env.PORT,()=>{
	console.log('serving on port 3000')
})