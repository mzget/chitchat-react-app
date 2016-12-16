const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
import { getConfig, DbClient } from '../config';
const webConfig = getConfig();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get('/:id', (req, res, next) => {
    req.checkParams("id", "Request for id as param").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    MongoClient.connect(webConfig.appDB).then(db => {
        let collection = db.collection(DbClient.user);
        collection.find({ _id: new ObjectID(req.params.id) }).project({ password: 0 }).limit(1).toArray().then(function (docs) {
            if (docs.length >= 1) {
                res.status(200).json({ success: true, data: docs });
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
