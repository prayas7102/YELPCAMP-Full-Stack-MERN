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

const sample=(array)=>{return array[Math.floor(Math.random()*array.length)]};
const seed= async()=>{
	await campground.deleteMany({});
	/*const l= new campground({title:'purple field'});
	await l.save();*/
	for(let i=0;i<5;i++)
	{
		// Math.floor(Math.random()*1000)
		const r=i;
		let c=cities.cities[r].city+ " "+ cities.cities[r].state;
		// console.log(c);
		let c1=c;
		if(c1.includes("'",".","(",")")){
		    c1=c1.replace("'"," ");
		}if(c1.includes(".")){
		    c1=c1.replace("."," ");
		}if(c1.includes("(")){
		    c1=c1.replace("("," ");
		}if(c1.includes(")")){
		    c1=c1.replace(")"," ");
		}if(c1.includes(",")){
		    c1=c1.replace(","," ");
		}
		if(c1.includes("-")){
		    c1=c1.replace("-"," ");
		}
		const camp = new campground({
			// type: "Feature", 
			// properties: { "id": "ak16994521", "mag": 2.3, "time": 1507425650893, "felt": null, "tsunami": 0 },
			title: sample(descriptors) + sample(places),
			location: c1,
			author: "6198a37897db2103806f264b",
			image:[
				{url:'https://res.cloudinary.com/dspuaavtt/image/upload/v1637733543/kxwizvxyvhx5zxinp75m.jpg',filename:'kxwizvxyvhx5zxinp75m'},
				{url:'https://res.cloudinary.com/dspuaavtt/image/upload/v1637733542/yljxe2rkfsp29tuyo5kl.jpg',filename:'yljxe2rkfsp29tuyo5kl'},
				{url:'https://res.cloudinary.com/dspuaavtt/image/upload/v1637733541/reappghs6lilegraoyn4.jpg',filename:'reappghs6lilegraoyn4'}
			],
			geometry:{
				type:"Point",
				coordinates:[cities.cities[r].longitude, cities.cities[r].latitude]
			},
			description: 'lora',
			price:100
		})
	//console.log(camp.location);
//	console.log((cities.cities[r].city+cities.cities[r].state));
	await camp.save()
}}
seed(); 