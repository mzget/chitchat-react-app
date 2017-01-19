import express = require('express');
import mongodb = require('mongodb');

import * as apiUtils from '../scripts/utils/apiUtils';

const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;


import { ChitChatUser } from '../scripts/models/User';
import { getConfig, DbClient } from '../config';
const config = getConfig();

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
      let collection = db.collection(DbClient.userContactColl);

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
      res.status(500).json({ success: false, message: err })
    });
  }
  else if (query.id) {
    let user_id: mongodb.ObjectID = null;
    try {
      user_id = new mongodb.ObjectID(query.id);
    }
    catch (err) {
      res.status(500).json({ success: false, message: "id is require for ObjectID." });
      return;
    }

    MongoClient.connect(config.appDB).then(function (db) {
      let collection = db.collection(DbClient.userContactColl);

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

router.get('/', (req, res, next) => {
    req.checkQuery("username", "Request for id as param").notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    MongoClient.connect(config.chatDB).then(db => {
        let collection = db.collection(DbClient.systemUsersColl);

        collection.find({ username: req.query.username }).project({ password: 0 }).limit(1).toArray().then(function (docs) {
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

router.post('/signup', function (req: express.Request, res: express.Response, next) {
    req.checkBody('user', 'request for user object').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }

    let user = req.body.user;

    let userModel = new ChitChatUser();
    userModel.displayname = user.username;
    userModel.username = user.email;
    userModel.email = user.email;
    userModel.password = user.password;
    userModel.firstname = user.firstname;
    userModel.lastname = user.lastname;
    userModel.tel = user.tel;
    userModel.teams = new Array();

    MongoClient.connect(config.chatDB).then(function (db) {
        let collection = db.collection(DbClient.systemUsersColl);

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

router.get('/teams', (req, res, next) => {
    req.checkQuery('user_id', 'request for user_id').isMongoId();

    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }

    let user_id = new mongodb.ObjectID(req.query.user_id);

    async function findUserTeams() {
        let db = await MongoClient.connect(config.chatDB);
        let collection = db.collection(DbClient.systemUsersColl);

        let user = await collection.find({ _id: user_id }).project({ teams: 1 }).limit(1).toArray();
        db.close();
        return user[0];
    }

    async function findTeamsInfo(team_ids: string[]) {
        let db = await MongoClient.connect(config.chatDB);
        let collection = db.collection(DbClient.teamsColl);

        let teams = await collection.find({ _id: { $in: team_ids } }).limit(10).toArray();
        db.close();
        return teams;
    }

    findUserTeams().then((user: ChitChatUser) =>
        findTeamsInfo(user.teams)
    ).then(teams => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, teams));
    }).catch(err => {
        res.status(500).json(new apiUtils.ApiResponse(false, err));
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

var addGroupMember = function (roomId: string, user: ChitChatUser, done: () => void) {
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
            if (err) { return console.dir(err); }

            console.warn('account;', value);
            var account: MuserModel.UserModel = JSON.parse(JSON.stringify(value));
            var member: MroomModel.Member = new MroomModel.Member();
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
}

module.exports = router;
