var db = require('./models');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


console.log(db,'db');
db.sequelize.sync();





app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});