const router = express.Router();
const ObjectID = mongodb.ObjectID;
import { ChatRoomManager } from "../scripts/controllers/ChatRoomManager";
import * as UserManager from "../scripts/controllers/UserManager";
const chatRoomManager = ChatRoomManager.prototype;
/* GET home page. */
router.get('/', function (req, res, next) {
    next();
});
/**
/* Require owner memberId and roommate id.
* For get one-to-one chat room.
*/
router.post('/', function (req, res, next) {
    req.checkBody("ownerId", "request for ownerId").isMongoId();
    req.checkBody("roommateId", "request for roommateId").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let id = '';
    let owner = req.body.ownerId;
    let roommate = req.body.roommateId;
    if (owner < roommate) {
        id = owner.concat(roommate);
    }
    else {
        id = roommate.concat(owner);
    }
    let md = crypto.createHash('md5');
    md.update(id);
    let hexCode = md.digest('hex');
    let roomId = hexCode.slice(0, 24);
    chatRoomManager.GetChatRoomInfo(roomId).then(function (results) {
        console.log("GetChatRoomInfo", roomId, results);
        res.status(200).json({ success: true, result: results });
    }).catch(err => {
        res.status(500).json({ success: false, message: err });
    });
});
/**
 * Create chatroom.
 */
router.post('/createPrivateRoom', function (req, res, next) {
    req.checkBody("owner", "request for owner user").notEmpty();
    req.checkBody("roommate", "request for roommate user").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    let id = '';
    let owner = req.body.owner;
    let roommate = req.body.roommate;
    if (owner._id < roommate._id) {
        id = owner._id.concat(roommate._id);
    }
    else {
        id = roommate._id.concat(owner._id);
    }
    let md = crypto.createHash('md5');
    md.update(id);
    let hexCode = md.digest('hex');
    let roomId = hexCode.slice(0, 24);
    let _tempArr = [owner, roommate];
    let _room = new Room.Room();
    _room._id = new ObjectID(roomId);
    _room.type = Room.RoomType.privateChat;
    _room.members = _tempArr;
    _room.createTime = new Date();
    chatRoomManager.createPrivateChatRoom(_room).then(function (results) {
        console.log("Create Private Chat Room: ", JSON.stringify(results));
        //<!-- Push updated lastAccessRoom fields to all members.
        async.map(results[0].members, function (member, cb) {
            //<!-- Add rid to user members lastAccessField.
            UserManager.AddRoomIdToRoomAccessFieldForUser(results[0]._id, member._id, new Date()).then((res) => {
                console.log("add roomId to roomaccess fields", res);
                cb(null, null);
            }).catch(err => {
                cb(err, null);
            });
        }, function (errCb) {
            console.log("add roomId to roomaccess fields done.", errCb);
        });
        res.status(200).json({ success: true, result: results });
    }).catch(err => {
        console.warn("createPrivateChatRoom fail", err);
        res.status(500).json({ success: false, message: err });
    });
});
router.get("/roomInfo", (req, res, next) => {
    req.query("room_id", "request for room_id").isMongoId();
    req.query("user_id", "request for user_id").isMongoId();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json({ success: false, message: errors });
    }
    // self.app.rpc.auth.authRemote.checkedCanAccessRoom(session, rid, uid, function (err, res) {
    //     console.log("checkedCanAccessRoom: ", res);
    //     if (err || res === false) {
    //         next(null, { code: Code.FAIL, message: "cannot access your request room." });
    //     }
    //     else {
    //         chatRoomManager.GetChatRoomInfo(rid).then(function (res) {
    //             next(null, { code: Code.OK, data: res });
    //         }).catch(err => {
    //             next(null, { code: Code.FAIL, message: "Your request roomInfo is no longer." });
    //         });
    //     }
    // });
});
module.exports = router;
