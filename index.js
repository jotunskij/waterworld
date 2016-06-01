var express = require('express');
var basicAuth = require('basic-auth-connect');
var bodyParser = require('body-parser');
var app = express();

app.use(basicAuth('asadani', 'Parkvillan'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/api', function (req, res) {
  res.json({ 'msg' : 'Hello world!'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});