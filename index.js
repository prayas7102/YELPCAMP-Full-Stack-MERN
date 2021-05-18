const express = require('express');
const app=express();
const path=require('path');
const methodOverride=require('method-override');
const ejsmate=require('ejs-mate');
const mongoose=require('mongoose');
const campground=require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});
/*const db="mongodb+srv://mongoprayas:mongoprayas7@@prayascluster.xeyfs.mongodb.net/yelp-camp?retryWrites=true&w=majority";
mongoose.connect(db,{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});*/
//const db=mongoose.connection;
app.engine('ejs',ejsmate)
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.get('/',(req,res)=>{
	res.render('home.ejs')
})
app.get('/makecampground',async (req,res)=>{
	const camp = new  campground({title:'vhjvgfdhjsbfvs', location:'nbvxgdn'});
	await camp.save();
	res.send(camp);
});
app.get('/campgrounds/new',(req,res)=>{
	res.render('campgrounds/new');
});
app.post('/campgrounds', async(req,res)=>{
	const campgrounds= new campground(req.body.campground);
	await campgrounds.save();
	//console.log(req.params);
	res.redirect('/campgrounds');
});
app.get('/campgrounds/:id', async(req,res)=>{
	const campgrounds = await campground.findById(req.params.id);
	//console.log(req.params);
	res.render('campgrounds/show',{campgrounds});
});
app.get('/campgrounds/:id/edit', async(req,res)=>{
	const campgrounds = await campground.findById(req.params.id);
	//console.log(req.params);
	res.render('campgrounds/edit',{campgrounds});
});
app.get('/campgrounds', async(req,res)=>{
	const campgrounds= await campground.find({});
	//console.log(campgrounds)
	res.render('campgrounds/app',{campgrounds});
} )
app.put('/campgrounds/:id', async(req,res)=>{
	const {id}=req.params;
	console.log(req.body.campground.title);
	const campgrounds=await campground.findByIdAndUpdate(id,{...req.body.campground});
	res.redirect('/campgrounds/'+campgrounds._id);
});
app.delete('/campgrounds/:id',async(req,res)=>{
	console.log('h');
	const{id}=req.params;
	await campground.findByIdAndDelete(id);
	res.redirect('/campgrounds');
});
app.listen(8000,()=>{
	console.log('serving on port 3000')
})