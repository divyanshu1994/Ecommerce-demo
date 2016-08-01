var express=require('express');
var mongoose=require('mongoose');
var User=require('./models/user');
var morgan=require('morgan');
var bodyParser=require('body-parser');
var ejs_mate=require('ejs-mate'); // for doing boilerplate like things
var urlencoded=bodyParser.urlencoded({extended:true});
var jsonParser=bodyParser.json();
var flash=require('express-flash'); // Note : flash require sessions
var session=require('express-session');
var cookieParser=require('cookie-parser');
var ConnectMongo=require('connect-mongo/es5')(session) ;  // use for storing session data in database 
var passport=require('passport');

//models
var Category=require('./models/category');


var app=express();

//import routs
var main_route=require('./routes/main');
var user_route=require('./routes/user');
var admin_route=require('./routes/admin');
var faker_api_route=require('./api/faker_api');
var api_route=require('./api/api');

//config files
var config=require('./config/config');

//middlewares

app.use(express.static(__dirname+"/public")); //static files
app.engine('ejs',ejs_mate);
app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(urlencoded);
app.use(jsonParser);
app.use(flash());
app.use(cookieParser());
app.use(session({
  resave:true,
  saveUninitialized:true,  // save a new session whcih is not modified
  secret:config.secret,
  //define store for session
  store:new ConnectMongo({
    url:config.db_name,
    autoReconnect:true
  })
}));
app.use(passport.initialize()); // to use our middle ware
app.use(passport.session()); // to use serialisation and deserialization
//middleware for having user in all the views that is we can get it as user.profile.name without sending to every ejs file manually through routes
app.use(function(req,res,next)
{
  res.locals.user=req.user;

  next();
}); 
//middleware to have categories in all views
app.use(function(req,res,next)
{
  Category.find({},function(err,categories)
  {
    if(err) return next(err);

    res.locals.categories=categories;

    next();
  });
});



//mongoose connect
mongoose.connect(config.db_name, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

app.use('/',main_route);
app.use('/user',user_route);
app.use('/admin',admin_route);
app.use('/faker-api',faker_api_route);
app.use('/api',api_route);

//listen to server
app.listen(config.port,function(err)
{
  console.log("Listening to port "+config.port);
});

