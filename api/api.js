var router=require('express').Router();
var Product=require('../models/product');
var User=require('../models/user');

router.post('/search',function(req,res,next)
{
    res.redirect('/api/search?q='+req.body.search);
});

router.get('/search',function(req,res,next)
{
    var q=req.query.q;
   
    Product.find({name:{$regex:q}},function(err,products)
    {
        if(err) return next(err);

        res.redirect('/adss');
    });
});


router.get('/mykart',function(req,res,next)
{
    var cart=req.user.cart;

    User.find({_id:req.user._id})
    .populate('cart.product')
    .exec(
    function(err,user)
    {
        if(err) return next(err);

        res.json(user);
    });

 });

module.exports=router;