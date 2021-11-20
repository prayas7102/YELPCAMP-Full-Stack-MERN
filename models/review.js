const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const User=require('./user');
const ReviewSchema = new Schema({
	body:String,
	star:Number,
	person:{
		type: Schema.Types.ObjectID,
		ref: User
	}
});
module.exports=mongoose.model('Review',ReviewSchema);