var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var ObjectID = require('mongodb').ObjectID;

var server = new Server('localhost', 27017, {
    auto_reconnect: true
});

db = new Db('soundIt', server);

db.open(function (err, db) {
    if (!err) {
        console.log('Connected to soundIt database');
        db.collection('soundIt', {
            strict: true
        }, function (err, collection) {
            if (err) {
                console.log('The soundIt collection does not exist. Creating it with sample data...');
                populateDB();
            }
        });
    }
});

var populateDB = function () {
    var sounds = [{
        name: 'sound of database 1'
    }, {
        name: 'sound of database 2'
    }];

    db.collection('soundIt', function (err, collection) {
        collection.insert(sounds, {
            safe: true
        }, function (err, result) {});
    });
};

exports.findById = function (req, res) {
    var id = new ObjectID(req.params.id);
    console.log('Retrieving sound: ' + id);
    db.collection('soundIt', function (err, collection) {
        collection.findOne({
            '_id': id
        }, function (err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function (req, res) {
    db.collection('soundIt', function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};
