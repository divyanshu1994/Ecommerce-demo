//routes for main page , about ,products etc
var router=require('express').Router();
var Product=require('../models/product');
var User=require('../models/user');


router.get('/',function(req,res)
{

    res.render('main/home');
});

router.get('/about',function(req,res)
{
    res.render('main/about');
});

// route to show product according to a category
router.get('/category/:id/page/:pageNum',function(req,res,next)
{
    var pageNum=req.params.pageNum;
    var pageItems=9;

    Product
    .find({category:req.params.id})
    .skip(pageItems*(pageNum-1))
    .limit(pageItems)
    .populate('category')  // can access now product.category.name using populate
    .exec(
    function(err,products)
    {
        if(err) return next(err);

        Product.count()  // to have total number of data in pages
        .exec(function(err,count)
        {
            if(err) return next(err);

            res.render('main/category_page',
            {
                products:products,
                count:count/pageItems
            });

        });
  // res.json(products);  --when to be used as api
       
    });

  
    
});

router.get('/product/:id',function(req,res,next)
{
    Product.findOne({_id:req.params.id})
    .populate('category')
    .exec(function(err,product)
    {
        res.render('main/single_product',{product:product});
       // res.json(product);  -- when to be used as api
    });
    
});

router.post('/search',function(req,res,next)
{
    res.redirect('/search?q='+req.body.q);
});

router.get('/search',function(req,res,next)
{
    var q=req.query.q;

   q= q.capitalize();
   
    Product.find({name:{$regex:q}})
    .populate('category')
    .exec(function(err,products)
    {
        if(err) return next(err);

       // res.json(products);  for api used
       res.render('main/search_page',{query:q,products:products});

    });
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

router.get('/purchase/:productId',function(req,res,next)
{
   User.update({_id:req.user.id} // which user
   , 
   // add item to cart
   {
       //what ro update
       $addToSet:   // to add in array
       {
           cart:{  // name of array
               //new item to cart
               product:req.params.productId,
               addedOn:"31 July 2016"

}
 }
   })
  
   .exec(
   function(err,updatedUser)
   {
      res.redirect('/user/mycart');
      
      
   }
   );
  
});
module.exports=router;