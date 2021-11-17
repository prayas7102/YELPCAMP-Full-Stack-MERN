const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passlocalmong=require('passport-local-mongoose');
const passport=require('passport');
const userSchema = new Schema({
	email:{type:String,required:true,unique:true},
});
userSchema.plugin(passlocalmong);
module.exports=mongoose.model('user',userSchema);