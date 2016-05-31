var express = require('express');
var basicAuth = require('basic-auth-connect');
var app = express();

app.use(basicAuth('asadani', 'Parkvillan'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});