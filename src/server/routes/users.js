const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
import { getConfig, DbClient } from '../config';
const webConfig = getConfig();
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
        MongoClient.connect(webConfig.appDB).then(db => {
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
        MongoClient.connect(webConfig.appDB).then(function (db) {
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
router.get('/agent/:username', (req, res, next) => {
    req.checkParams("username", "Request for id as param").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    MongoClient.connect(webConfig.backendDB).then(db => {
        let collection = db.collection(DbClient.user);
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
        res.status(500).json({ success: false, message: err });
    });
});
module.exports = router;
