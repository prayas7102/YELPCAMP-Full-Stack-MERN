const mongoose=require('mongoose');
const Review=require('./review');
const User=require('./user');
const Schema=mongoose.Schema;
const CampgroundSchema = new Schema({
	title:String,
	// type: String, 
	// properties: { id: String, mag: Number, time: Number, felt: Number, tsunami: Number },
	image:[{
		url:String,filename:String
	}],
	geometry:{
		type:{
			type:String,
			enum:['Point'],
			
		},
		coordinates:{
			type:[Number],
		}
},
	price:Number,
	description: String,
	location:String,
	author:{
		type: Schema.Types.ObjectID,
		ref: User
	},
	reviews: [
		{
			type: Schema.Types.ObjectID,
		    ref: Review
		}
	]
});
CampgroundSchema.post('findOneAndDelete',async function(doc){
	if(doc){
		await Review.deleteMany({_id:{$in: doc.reviews}});
	}
});
module.exports=mongoose.model('campground',CampgroundSchema);