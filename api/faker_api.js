var router=require("express").Router();
var faker=require("faker");
var async=require("async");
var Product=require('../models/product');
var Category=require('../models/category');

router.get('/:name',function(req,res,next)
{
    // make 30 products of category named name

    async.waterfall([
        function(callback)
        {
            Category.findOne({name:req.params.name},function(err,category)
            {
                if(err) return next(err);

                if(!category)  //category doesnot exist
                {
                    return res.json("Invalid category");
                }
                callback(null,category);
            });
        },
        function(category,callback)
        {
            //store 30 products

            for(var i=0;i<30;i++)
            {
            var product=new Product();
            product.category=category._id;
            product.name=faker.commerce.productName();
            product.price=faker.commerce.price();
            product.image=faker.image.image();

            product.save();
            }
             res.json("Success");   
        }
    ]);
   
});

module.exports=router;