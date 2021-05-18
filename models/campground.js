const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const CampgroundSchema = new Schema({
	title:String,
	location:String
});
module.exports=mongoose.model('campground',CampgroundSchema);