const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const CampgroundSchema = new Schema({
	title:String,
	image:String,
	price:Number,
	description: String,
	location:String,
	reviews: [
		{
			type: Schema.Types.ObjectID,
		    ref: "Review"
		}
	]
});
CampgroundSchema.post('findOneAndDelete',async function(doc){
	if(doc){
		await reviews.deleteMany({
			_id:{
				$in: doc.reviews
			}
		});
	};
});
module.exports=mongoose.model('campground',CampgroundSchema);