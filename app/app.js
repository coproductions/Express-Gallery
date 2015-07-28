var db = require('../models');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var redactor = require('../lib/redactor.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');


db.sequelize.sync();

//modules

//tell express which template engine to use
app.set('view engine','jade');
//tell express where our template folder is
app.set('views','./views');





//app settings
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(session(
  {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }
));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User.findOne({id:id})
  .then(function(user){
    done(null, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.findOne({where:{ username: username }})
    .then(function(user) {
      // console.log(user.username)
      // console.log('logging password',password)
      if (user.password !== createHash(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

app.use(bodyParser.urlencoded({extended:false}))
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// app.use(methodOverride());

function ajaxPull(jsonSource) {

  $.ajax({
    method: 'GET',
    url: (jsonSource),
    dataType: 'json'
  })
  .done(function(res) {
    // console.log('got the data:',res);
  })
  .fail(function() {
    throw new Error('There was a problem with the request.');
  })
  .always(function() {
    //Always update the UI with status
  });
}

app.use('/gallery',redactor);

app.use(function(req, res, next){
  app.locals.user = req.user;
  // console.log('what is user',app.locals.user)
  next();
});

function ensureAuthenticated(req, res, next) {
  console.log('outside if')
  if (req.isAuthenticated()) {
    console.log('inside if')
    return next();
  }
  // res.redirect('/login')
  res.json({showLogInModal:true})
}

function createHash(password){
  var shasum = crypto.createHash('sha1');
  shasum.update(password);
  return shasum.digest('hex');
}






app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login'
                                  })
);

app.get('/login',function(req,res){
  res.render('login')
});

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
})

app.get('/signup',function(req,res){
  res.render('signup')
});

app.post('/signup', function(req,res){

  db.User.findOrCreate({where:{username: req.body.username},defaults:{password:createHash(req.body.password)}})
  .spread(function(user, created){
    // console.log('created user: ',created);
    if(created){
      res.redirect('/login')
    }else{
      res.render('signup',{username: user.username})
      // res.send('username: '+req.body.username+' already exists')
    }
  })
});


app.get('/', function (req, res) {
  db.Picture.findAll().then(function(pictures){
    res.render('gallery',{pictures:pictures})
  })
});

app.get('/gallery/:id', function(req, res) {
  db.Picture.findById(req.params.id).then(function(picture) {
  // project will be an instance of Project and stores the content of the table entry
    if(picture){
      db.Picture.findAll().then(function(pictures){

        res.render('single',{
          singlePic : picture.dataValues,
          allPics : pictures
        });
      })
    }else{
      res.render('picnotfound',{id : req.params.id});
    }
  });
});

app.post('/gallery', function(req, res){
  db.Picture.create({author:req.body.author,link:req.body.link,description:req.body.description})
    .then(function(task){
      db.Picture.findAll().then(function(pictures){
        res.send({
          singlePic : task.dataValues,
          allPics : pictures
      });
    });
  });
});

app.put('/gallery/:id',function(req, res){
  console.log('going into put',req.body)
  db.Picture.findById(req.body.id)
  .then(function(picture){
    console.log('found picture and now editind',picture)
    picture.updateAttributes(
        {author:req.body.author,link:req.body.link,description:req.body.description},
        {where:{id:req.params.id}})
        .then(function(test){
        //   db.Picture.findAll().then(function(pictures){
        //     res.render('single',{
        //       singlePic : picture.dataValues,
        //       allPics : pictures
        //       });

        //   })
        //   console.log('successful edit');
        //   // res.render('single',params.id)

          res.send(test)
        })
        .catch(function(){
            console.log('error tryieng to edit');
        });
  }).catch(function(){
    res.render('picnotfound',{id : req.params.id});
    console.log('could not find the id')
  });
});

app.get('/new_photo',function(req, res){
  res.render('postform');
});

app.delete('/gallery/:id',ensureAuthenticated,function(req, res){
    db.Picture.findById(req.body.id)
    .then(function(picture){
      picture.destroy()
      .then(function(){
        console.log(req.body)
        res.send(req.body)
        // res.json(req.body)
        console.log('delete successful')
      })
      .catch(function(){
         res.send('could not delete')
        console.log('could not delete')
      })
    }).catch(function(){
      res.render('picnotfound',{id : req.params.id});
      console.log('could not find the photo');
    })

});

app.get('/gallery/:id/edit',ensureAuthenticated,function(req, res){
  db.Picture.findById(req.params.id).then(function(picture){
    if(picture){
      res.render('editpicture',picture.dataValues)
    }else{
      res.render('picnotfound',{id: req.params.id});
    }
  });
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});