var express = require('express');
var app = express();

var __dirname = './dist/';
// var __dirname = "../sentienceinstitute.github.io/";

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname});
});

app.get('/blog/:path', function (req, res) {
  var path = req.params.path;
  res.sendFile(path + '.html', { root: __dirname + 'blog/'});
});

app.get('/press/:path', function (req, res) {
  var path = req.params.path;
  res.sendFile(path + '.html', { root: __dirname + 'press/'});
});

app.get('/:path', function (req, res) {
  var path = req.params.path;
  res.sendFile(path + '.html', { root: __dirname});
});

app.listen(3000,function(){
  console.log('Listening on port 3000');
});
