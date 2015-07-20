var db = require('../models');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');



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

app.use(bodyParser.urlencoded({extended:false}))
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))



app.get('/', function (req, res) {
  db.Picture.findAll().then(function(pictures){
    res.render('gallery',{pictures:pictures})
  })
});

app.get('/gallery/:id', function(req, res) {
  db.Picture.findById(req.params.id).then(function(picture) {
  // project will be an instance of Project and stores the content of the table entry
    if(picture){
      res.render('single',picture.dataValues);
    }else{
      res.render('picnotfound',{id : req.params.id});
    }
  });
});

app.post('/gallery', function(req, res){
  db.Picture.create({author:req.body.author,link:req.body.link,description:req.body.description})
  .then(function(task){
    console.log(task)
    res.render('single',task.dataValues)
  });
});

app.put('/gallery/:id', function(req, res){
  db.Picture.findById(req.params.id)
  .then(function(picture){
    picture.updateAttributes(
        {author:req.body.author,link:req.body.link,description:req.body.description},
        {where:{id:req.params.id}})
        .then(function(test){
          console.log('successful edit');
          // res.render('single',params.id)

        }).catch(function(){
            console.log('error tryieng to edit');
        });
  }).catch(function(){
    console.log('could not find the id')
  });
});

app.get('/new_photo',function(req, res){
  res.render('postform');
});

app.delete('/gallery/:id', function(req, res){
    db.Picture.findById(req.params.id)
    .then(function(picture){
      picture.destroy()
      .then(function(){
        res.send('delete successful')
        console.log('delete successful')
      })
      .catch(function(){
         res.send('could not delete')
        console.log('could not delete')
      })
    }).catch(function(){
      res.send('could not find the photo')
      console.log('could not find the photo')
    })

});

app.get('/gallery/:id/edit',function(req, res){
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