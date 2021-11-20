const islogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','Need to be logged in first!!');
        req.session.returnto=req.originalUrl;
        return res.redirect('/login');
    }
    next();
}
module.exports=islogin;