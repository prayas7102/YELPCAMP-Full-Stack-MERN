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
	for(let i=0;i<cities.cities.length;i++)
	{
		const r=Math.floor(Math.random()*1000);
		const camp = new campground({
			title: sample(descriptors) + sample(places),
			location: cities.cities[r].city+ " "+ cities.cities[r].state,
			author: "6198a37897db2103806f264b",
			image:[
				{url:'https://res.cloudinary.com/dspuaavtt/image/upload/v1637733543/kxwizvxyvhx5zxinp75m.jpg',filename:'kxwizvxyvhx5zxinp75m'},
				{url:'https://res.cloudinary.com/dspuaavtt/image/upload/v1637733542/yljxe2rkfsp29tuyo5kl.jpg',filename:'yljxe2rkfsp29tuyo5kl'},
				{url:'https://res.cloudinary.com/dspuaavtt/image/upload/v1637733541/reappghs6lilegraoyn4.jpg',filename:'reappghs6lilegraoyn4'}
			],
			geometery:{
				type:"Point",
				coordinates:[cities.cities[r].longitude,cities.cities[r].latitude]
			},
			description: 'lora',
			price:100
		})
	//console.log(camp.location);
//	console.log((cities.cities[r].city+cities.cities[r].state));
	await camp.save()
}}
seed(); 