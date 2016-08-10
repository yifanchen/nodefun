var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('George!');
})

app.get('/hostage', function(req, res) {
  res.send('Hostage!');
})

var server = app.listen(3000, function() {
  console.log('Server running at http://localhost:' + server.address().port);
});

