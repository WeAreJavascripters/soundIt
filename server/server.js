var express = require('express');
var sounds = require('./sounds');

var app = express();

app.get('/sounds', sounds.findAll);
app.get('/sounds/:id', sounds.findById);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('soundIt app listening at http://%s:%s', host, port);
});
