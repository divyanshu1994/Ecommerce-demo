var router=require('express').Router();
var Category=require('../models/category');

router.get('/add-category',function(req,res,next)
{
    res.render('admin_views/add_category',{added:req.flash("added"),fail:req.flash("fail")});
});


router.post('/add-category',function(req,res,next){

var category=new Category();
category.name=req.body.name;


    Category.findOne({name:req.body.name},function(err,existingCategory)
    {
        if(err) return next(err);

        if(existingCategory) 
        {
            console.log("category exists");
            req.flash("fail","Category with same name already present");
            return res.redirect("/admin/add-category");
        }
        else{


        category.save(function(err)
            {
            if(err) return next(err);

            req.flash("added","New Category added");
           return res.redirect("/admin/add-category");

            });

        }
    
    });
  

});


module.exports=router;