const express = require('express');
const app=express();
const cities=require('./cities');
//console.log(cities.cities[0]);
const {places,descriptors}=require('./seedshelper');
const path=require('path');
const mongoose=require('mongoose');
const campground=require('../models/campground');
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
const sample=(array)=>{return array[Math.floor(Math.random()*array.length)]};
const seed= async()=>{
	await campground.deleteMany({});
	/*const l= new campground({title:'purple field'});
	await l.save();*/
	for(let i=0;i<50;i++)
	{
		const r=Math.floor(Math.random()*1000);
		const camp = new campground({
			title: sample(descriptors) + sample(places),
			location: cities.cities[r].city+ " "+ cities.cities[r].state
		})
	//console.log(sample(descriptors) + sample(places));
//	console.log((cities.cities[r].city+cities.cities[r].state));
	await camp.save()
}}
seed(); 