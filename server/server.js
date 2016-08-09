var express = require('express');
var sounds = require('./sounds');

var app = express();

app.get('/sounds', sounds.findAll);
app.get('/sounds/:id', sounds.findById);
app.use(express.static('./dist/'));
app.use('/lib', express.static('./node_modules/'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('soundIt app listening at http://%s:%s', host, port);
});
