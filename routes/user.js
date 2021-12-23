const express = require('express');
const catchAsync=require('../util/catchAsync');
const AppError=require('../util/AppError');
const campground=require('../models/campground');
const Review=require('../models/review');
const User=require('../models/user');
const router=express.Router({mergeParams:true});
const joischema =require('../joischema');
const passlocalmong=require('passport-local-mongoose');
const nodemailer=require('nodemailer');
const crypto= require('crypto');
const passport=require('passport');
 const async=require('async');
const validatecamp =(req,res,next)=>{
	const {error}=joischema.validate(req.body);
	//console.log(req.body,error)
	if(error){
		throw new AppError(error.message,400);
	}else{
		next();
	}
}
router.route('/register')
	.get((req,res,next)=>{
	res.render('register');
})
	.post(catchAsync(async(req,res,next)=>{
	try{
		const {username,password,email}=req.body.register;
		const user=new User({email,username});
		const registeruser=await User.register(user,password);
		req.login(registeruser,function(error){
			if(error){return next(error)}
			req.flash('success','Welcome to Yelp-Camp');
			return res.redirect('/campgrounds');
		});
	}
	catch(e){
		req.flash('error',e.message)
		return res.redirect('/register');
	}
}));
router.route('/login')
	.get((req,res,next)=>{
	res.render('login');
})
	.post(passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),(req,res)=>{
	req.flash('success','Logged in successfuly !!');
	// console.log(req.body)
	const redirect=req.session.returnto || '/campgrounds';
	res.redirect(redirect);
});
router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('success','Successfully logged out');
	res.redirect('/campgrounds');
});
router.route('/forgotpassword')
	.get((req,res)=>{
		req.flash('success','Try to reset password');
		res.render('forgotpassword');})
	.post((req,res,next)=>{
		async.waterfall([
			function(done) {
			  crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			  });
			},
			function(token, done) {
			  User.findOne({ email: req.body.email }, function(err, user) {
				if (!user) {
				  req.flash('error', 'No account with that email address exists.');
				  return res.redirect('/forgotpassword');
				}
				
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		
				user.save(function(err) {
				    
					done(err, token, user);
				});
			  });
			},
			function(token, user, done) {
			// console.log(token)				
			  var smtpTransport = nodemailer.createTransport({
				 service: 'gmail', 
				auth: {
				  user: 'prayasshutter7@gmail.com',
				  pass: 'chutiya7@P'
				}
			  });
			  var mailOptions = {
				to: user.email,
				from: 'prayasshutter7@gmail.com',
				subject: 'Node.js Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
				  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			  };
			  smtpTransport.sendMail(mailOptions, function(err) {
				
				req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				res.redirect('/campgrounds');
				done(err, 'done');
			  });
			}
		  ], function(err) {
			if (err)
			{console.log("error"); return next(err);}
			req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
			res.redirect('/login');
	  });
});
router.get('/reset/:token', function(req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	  if (!user) {
		req.flash('error', 'Password reset token is invalid or has expired.');
		return res.redirect('/forgotpassword');
	  }
	  res.render('reset', {token: req.params.token});
	});
  });
  
  router.post('/reset/:token', function(req, res) {
	async.waterfall([
	  function(done) {
		User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		  if (!user) {
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('back');
		  }
		  if(req.body.password === req.body.confirm) {
			user.setPassword(req.body.password, function(err) {
			  user.resetPasswordToken = undefined;
			  user.resetPasswordExpires = undefined;
  
			  user.save(function(err) {
				req.logIn(user, function(err) {
				  done(err, user);
				});
			  });
			})
		  } else {
			  req.flash("error", "Passwords do not match.");
			  return res.redirect('back');
		  }
		});
	  },
	  function(user, done) {
		var smtpTransport = nodemailer.createTransport({
		  service: 'Gmail', 
		  auth: {
			user: 'prayasshutter7@gmail.com',
			pass: process.env.GMAILPW
		  }
		});
		var mailOptions = {
		  to: user.email,
		  from: 'prayasshutter7@gmail.com',
		  subject: 'Your password has been changed',
		  text: 'Hello,\n\n' +
			'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
		};
		smtpTransport.sendMail(mailOptions, function(err) {
		  req.flash('success', 'Success! Your password has been changed.');
		  done(err);
		});
	  }
	], function(err) {
	  res.redirect('/campgrounds');
	});
  });
module.exports=router;