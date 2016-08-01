// route for sign in sign up
// routes will automaticall begin with /user/

var router=require('express').Router();
var User=require('../models/user');
var passport=require('passport');
var passportConfig=require('../config/passport');
var Product=require('../models/product');

//middleware to access non signed up users to view pages
var areYouAuthenticated=function(req,res,next)
{
   if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/user/login');
}

router.get('/signup',function(req,res)
{
    res.render('auth_views/signup',{errors:req.flash('errors')});
});


router.post('/signup',function(req,res)
{
    var user =new User();
    user.profile.name=req.body.name;
    user.email=req.body.email;
    user.password=req.body.password;


        //find if username already there

        User.findOne({email:req.body.email},function(err,existingUser){
            if(existingUser)
            {
                req.flash("errors","Email id already taken"); // store error in errors variable
                return res.redirect('/user/signup');

            }
            else
            {
                //save user
         user.save(function(err){
        if(err) return next(err);
            
            // req.logIn saves the user data in session , if we dont do this we dont have req.user
            req.logIn(user,function(err)
            {
                if(err) return next(err);

                res.redirect('/user/profile');
            });
        });
            
            }
        });
   
});

router.get('/login',function(req,res)
{
    if(req.user)  // if alreay logged in
    {
        return res.redirect('/');  //redirect to home page
    }
    res.render('auth_views/login',{loginMessage:req.flash("loginMessage")});
});


// This will automatically post our email and password fields from login page to our
// iddleware named MyLocalLogin for authentification
router.post('/login',passport.authenticate('MyLocalLogin',{
    successRedirect:'/user/profile',  // if MyLocalLogin is success
    failureRedirect:'/user/login', // if MyLocalLogin gives failure 
    failureFlash:true
}));

router.get('/profile',areYouAuthenticated, function(req,res,next)
{

    res.render('auth_views/profile');

});

router.get('/mycart',areYouAuthenticated,function(req,res,next)
{
       User.findOne({_id:req.user._id})
    .populate('cart.product')
    .exec(
    function(err,user)
    {
        if(err) return next(err);

    res.render('auth_views/mycart',{cart:user.cart});
    });
});

router.get('/logout',areYouAuthenticated,function(req,res,next)
{
    console.log(req.user._id);
  req.logout();
    res.redirect('/');
});

module.exports=router;