"use strict";
const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const User_1 = require("../scripts/models/User");
const config_1 = require("../config");
const config = config_1.getConfig();
/* GET users listing. */
router.get('/contact/', function (req, res, next) {
    req.checkQuery("email", "Request for email as query param.").optional();
    req.checkQuery("id", "Request for id as query param").optional();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let query = req.query;
    if (query.email) {
        let email = query.email.toLowerCase();
        MongoClient.connect(config.appDB).then(db => {
            let collection = db.collection(config_1.DbClient.userContactColl);
            collection.find({ email: email }).project({ password: 0 }).limit(1).toArray().then(function (docs) {
                if (docs.length >= 1) {
                    res.status(200).json({ success: true, result: docs });
                    db.close();
                }
                else {
                    res.status(500).json({ success: false, message: "no user data." });
                    db.close();
                }
            });
        }).catch(err => {
            res.status(500).json({ success: false, message: err });
        });
    }
    else if (query.id) {
        let user_id = null;
        try {
            user_id = new mongodb.ObjectID(query.id);
        }
        catch (err) {
            res.status(500).json({ success: false, message: "id is require for ObjectID." });
            return;
        }
        MongoClient.connect(config.appDB).then(function (db) {
            let collection = db.collection(config_1.DbClient.userContactColl);
            collection.find({ _id: user_id }).project({ password: 0 })
                .limit(1).toArray().then(function (docs) {
                if (docs.length >= 1) {
                    db.close();
                    res.status(200).json({ success: true, result: docs });
                }
                else {
                    res.status(500).json({ success: false, message: "no user data." });
                    db.close();
                }
            }).catch(error => {
                res.status(500).json({ success: false, message: "db accesss fail.", error: error });
                db.close();
            });
        }).catch(err => {
            res.status(500).send({ success: false, message: "Cannot connect mongodb " + err });
        });
    }
    else {
        res.status(500).json({ success: false, message: "missing query string" });
    }
});
router.get('/:username', (req, res, next) => {
    req.checkParams("username", "Request for id as param").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    MongoClient.connect(config.chatDB).then(db => {
        let collection = db.collection(config_1.DbClient.systemUsersColl);
        collection.find({ username: req.params.username }).project({ password: 0 }).limit(1).toArray().then(function (docs) {
            if (docs.length >= 1) {
                res.status(200).json({ success: true, result: docs });
                db.close();
            }
            else {
                res.status(500).json({ success: false, message: "no user data." });
                db.close();
            }
        });
    }).catch(err => {
        res.status(500).json({ success: false, message: err + ': Cannot connect db.' });
    });
});
router.post('/signup', function (req, res, next) {
    req.checkBody('user', 'request for user object').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let user = req.body.user;
    let userModel = new User_1.ChitChatUser();
    userModel.displayname = user.username;
    userModel.username = user.email;
    userModel.email = user.email;
    userModel.password = user.password;
    userModel.firstname = user.firstname;
    userModel.lastname = user.lastname;
    userModel.tel = user.tel;
    MongoClient.connect(config.chatDB).then(function (db) {
        let collection = db.collection(config_1.DbClient.systemUsersColl);
        collection.createIndex({ email: 1 }, { background: true });
        collection.find({ email: user.email }).limit(1).toArray().then(function (docs) {
            if (docs.length >= 1) {
                res.status(500).json({ success: false, message: 'Account registed with your email is already used.' });
                db.close();
            }
            else {
                collection.insertOne(userModel).then(function onFulfilled(value) {
                    res.status(200).json({ success: true, result: value.ops });
                    db.close();
                }).catch(function onRejected(error) {
                    res.status(500).json({ success: false, message: error });
                    db.close();
                });
            }
        }).catch(err => {
            db.close();
            res.status(500).json({ success: false, message: err });
        });
    }).catch(err => {
        console.error("Cannot connect db: ", err);
        res.status(500).json({ success: false, message: err });
    });
});
router.get('/getOrgMembers', function (req, res, next) {
    MongoClient.connect(config.chatDB, function (err, db) {
        if (err) {
            throw err;
        }
        var collection = db.collection(Mdb.DbClient.userColl);
        collection.find({ "_id": { $exists: true } }).toArray().then(function (docs) {
            res.status(200).jsonp({ "success": true, "result": docs });
        });
    });
});
var addGroupMember = function (roomId, user, done) {
    var promise = new Promise(function (resolve, reject) {
        MongoClient.connect(config.chatDB, function (err, db) {
            if (err) {
                throw err;
            }
            var collection = db.collection(Mdb.DbClient.userColl);
            collection.find({ mail: user.mail }).limit(1).toArray().then(function (docs) {
                if (docs.length >= 1) {
                    db.close();
                    resolve(docs[0]);
                }
                else {
                    db.close();
                    reject(new Error('user account is no longer.'));
                }
            });
        });
    }).then(function onfulfilled(value) {
        MongoClient.connect(config.chatDB, function (err, db) {
            if (err) {
                return console.dir(err);
            }
            console.warn('account;', value);
            var account = JSON.parse(JSON.stringify(value));
            var member = new MroomModel.Member();
            member.id = account._id;
            // Get the documents collection
            var collection = db.collection(Mdb.DbClient.roomColl);
            // Find some documents
            collection.updateOne({ _id: new mongodb.ObjectID(roomId) }, { $push: { members: member } }).then(function (result) {
                console.info('addGroupMember;', result.result);
                db.close();
                if (!!done) {
                    done();
                }
            }).catch(function (err) {
                console.warn('addGroupMember;', err);
                db.close();
                if (!!done) {
                    done();
                }
            });
        });
    }).catch(function onRejected(err) {
        if (!!done) {
            done();
        }
    });
};
module.exports = router;
