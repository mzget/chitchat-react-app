"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
const async = require("async");
const DataModels = require("./models/ChatDataModels");
const chatLog_1 = require("./models/chatLog");
const BackendFactory_1 = require("./BackendFactory");
const httpStatusCode_1 = require("../libs/stalk/utils/httpStatusCode");
;
;
class Unread {
}
exports.Unread = Unread;
;
class ChatsLogComponent {
    constructor(_convertDateService) {
        this.serverImp = null;
        this.dataManager = null;
        this.dataListener = null;
        this.chatlog_count = 0;
        this.chatslog = {};
        this.unreadMessageMap = new Map();
        this.chatListeners = new Array();
        this._isReady = false;
        this.convertDateService = _convertDateService;
        this.dataManager = BackendFactory_1.default.getInstance().dataManager;
        this.dataListener = BackendFactory_1.default.getInstance().dataListener;
        this.dataListener.addRoomAccessListenerImp(this);
        BackendFactory_1.default.getInstance().getServer().then(server => {
            this.serverImp = server;
        }).catch(err => {
            console.log(err);
        });
        console.log("ChatsLogComponent : constructor");
    }
    getChatsLog() {
        return this.chatslog;
    }
    getUnreadMessageMap() {
        return this.unreadMessageMap;
    }
    addUnreadMessage(unread) {
        this.unreadMessageMap.set(unread.rid, unread);
    }
    getUnreadItem(room_id) {
        return this.unreadMessageMap.get(room_id);
    }
    addOnChatListener(listener) {
        this.chatListeners.push(listener);
    }
    onChat(dataEvent) {
        console.log("ChatsLogComponent.onChat");
        //<!-- Provide chatslog service.
        this.chatListeners.map((v, i, a) => {
            v(dataEvent);
        });
    }
    onAccessRoom(dataEvent) {
        let self = this;
        let roomAccess = dataEvent.roomAccess;
        let _rooms = new Map();
        this.dataManager.roomDAL.getKeys().then(keys => {
            async.map(keys, (room_id, cb) => {
                this.dataManager.roomDAL.get(room_id).then((room) => {
                    _rooms.set(room_id, room);
                    cb(null, null);
                });
            }, (err, results) => {
                addRoomData(_rooms);
            });
        }).catch(err => {
            done();
        });
        const addRoomData = (rooms) => {
            async.map(roomAccess, function iterator(item, resultCallback) {
                if (!rooms && !rooms.has(item.roomId)) {
                    resultCallback(null, null);
                }
                else {
                    let roomInfo = rooms.get(item.roomId);
                    if (roomInfo)
                        self.dataManager.addGroup(roomInfo);
                    resultCallback(null, null);
                }
            }, (err, results) => {
                done();
            });
        };
        const done = () => {
            self._isReady = true;
            if (!!self.onReady)
                self.onReady();
        };
    }
    onUpdatedLastAccessTime(dataEvent) {
        console.log("onUpdatedLastAccessTime", JSON.stringify(dataEvent));
        if (!!this.updatedLastAccessTimeEvent) {
            this.updatedLastAccessTimeEvent(dataEvent);
        }
    }
    onAddRoomAccess(dataEvent) {
        console.warn("ChatsLogComponent.onAddRoomAccess", JSON.stringify(dataEvent));
        if (!!this.addNewRoomAccessEvent) {
            this.addNewRoomAccessEvent(dataEvent);
        }
    }
    onUpdateMemberInfoInProjectBase(dataEvent) {
        console.warn("ChatsLogComponent.onUpdateMemberInfoInProjectBase", JSON.stringify(dataEvent));
    }
    onEditedGroupMember(dataEvent) {
        console.warn("ChatsLogComponent.onEditedGroupMember", JSON.stringify(dataEvent));
    }
    getUnreadMessages(token, roomAccess, callback) {
        let self = this;
        let unreadLogs = new Array();
        async.mapSeries(roomAccess, function iterator(item, cb) {
            if (!!item.roomId && !!item.accessTime) {
                let msg = {};
                msg["token"] = token;
                msg["roomId"] = item.roomId;
                msg["lastAccessTime"] = item.accessTime.toString();
                self.serverImp.getUnreadMsgOfRoom(msg, function res(err, res) {
                    if (err || res === null) {
                        console.warn("getUnreadMsgOfRoom: ", err);
                    }
                    else {
                        if (res.code === httpStatusCode_1.default.success) {
                            let unread = JSON.parse(JSON.stringify(res.data));
                            unread.rid = item.roomId;
                            unreadLogs.push(unread);
                        }
                    }
                    cb(null, null);
                });
            }
            else {
                cb(null, null);
            }
        }, function done(err) {
            console.log("getUnreadMessages from your roomAccess is done.");
            callback(null, unreadLogs);
        });
    }
    getUnreadMessage(token, roomAccess, callback) {
        let msg = {};
        msg["token"] = token;
        msg["roomId"] = roomAccess.roomId;
        msg["lastAccessTime"] = roomAccess.accessTime.toString();
        this.serverImp.getUnreadMsgOfRoom(msg, function res(err, res) {
            console.log("getUnreadMsgOfRoom: ", JSON.stringify(res));
            if (err || res === null) {
                callback(err, null);
            }
            else {
                if (res.code === httpStatusCode_1.default.success) {
                    let unread = JSON.parse(JSON.stringify(res.data));
                    unread.rid = roomAccess.roomId;
                    callback(null, unread);
                }
            }
        });
    }
    updatePersistRoomInfo(roomInfo) {
        this.dataManager.roomDAL.save(roomInfo._id, roomInfo);
    }
    decorateRoomInfoData(roomInfo) {
        if (roomInfo.type === DataModels.RoomType.privateChat) {
            let others = roomInfo.members.filter((value) => !this.dataManager.isMySelf(value._id));
            if (others.length > 0) {
                let contact = others[0];
                roomInfo.name = (contact.username) ? contact.username : "EMPTY ROOM";
                roomInfo.image = (contact.avatar) ? contact.avatar : null;
            }
        }
        return roomInfo;
    }
    getRoomInfo(room_id, callback) {
        let self = this;
        let msg = {};
        msg["token"] = self.dataManager.getSessionToken();
        msg["roomId"] = room_id;
        self.serverImp.getRoomInfo(msg, function (err, res) {
            console.log("getRoomInfo result", err, res);
            if (res.code === httpStatusCode_1.default.success) {
                let roomInfos = JSON.parse(JSON.stringify(res.data));
                let room = self.decorateRoomInfoData(roomInfos[0]);
                self.dataManager.addGroup(room);
                callback(null, room);
            }
            else {
                callback("Cannot get roomInfo", null);
            }
        });
    }
    getRoomsInfo() {
        let self = this;
        let results = new Array();
        // create a queue object with concurrency 2
        let q = async.queue(function (task, callback) {
            let value = task;
            let roomInfo = self.dataManager.getGroup(value.rid);
            if (!!roomInfo) {
                let room = self.decorateRoomInfoData(roomInfo);
                self.dataManager.addGroup(room);
                results.push(room);
                callback();
            }
            else {
                console.warn("Can't find roomInfo from persisted data: ", value.rid);
                self.getRoomInfo(value.rid, (err, room) => {
                    if (!!room) {
                        self.updatePersistRoomInfo(room);
                        results.push(room);
                        callback();
                    }
                    else {
                        callback(err);
                    }
                });
            }
        }, 2);
        // assign a callback
        q.drain = function () {
            results.map(room => {
                self.dataManager.roomDAL.save(room._id.toString(), room);
            });
            console.log("getRoomsInfo Completed.");
            if (self.getRoomsInfoCompleteEvent())
                self.getRoomsInfoCompleteEvent();
        };
        this.unreadMessageMap.forEach((value, key, map) => {
            // add some items to the queue
            q.push(value, function (err) { });
        });
    }
    manageChatLog() {
        let self = this;
        return new Promise((resolve, rejected) => {
            // create a queue object with concurrency 2
            let q = async.queue(function (task, callback) {
                let unread = task;
                let room = self.dataManager.getGroup(unread.rid);
                if (!room)
                    callback();
                self.organizeChatLogMap(unread, room, () => {
                    callback();
                });
            }, 2);
            // assign a callback
            q.drain = function () {
                resolve(self.chatslog);
            };
            this.unreadMessageMap.forEach((value, key, map) => {
                // add some items to the queue
                q.push(value, function (err) { });
            });
        });
    }
    organizeChatLogMap(unread, roomInfo, done) {
        let self = this;
        let log = new chatLog_1.default(roomInfo);
        log.setNotiCount(unread.count);
        if (!!unread.message) {
            log.setLastMessageTime(unread.message.createTime.toString());
            let contact = self.dataManager.getContactProfile(unread.message.sender);
            let sender = (contact != null) ? contact.displayname : "";
            if (unread.message.body != null) {
                let displayMsg = unread.message.body;
                switch (`${unread.message.type}`) {
                    case DataModels.ContentType[DataModels.ContentType.Text]:
                        /*
                            self.main.decodeService(displayMsg, function (err, res) {
                                if (!err) {
                                    displayMsg = res;
                                } else { console.warn(err, res); }
                            });
                        */
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Sticker]:
                        displayMsg = sender + " sent a sticker.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Voice]:
                        displayMsg = sender + " sent a voice message.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Image]:
                        displayMsg = sender + " sent a image.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Video]:
                        displayMsg = sender + " sent a video.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Location]:
                        displayMsg = sender + " sent a location.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.File]:
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    default:
                        console.log("bobo");
                        break;
                }
            }
        }
        else {
            let displayMsg = "Start Chatting Now!";
            self.setLogProp(log, displayMsg, function (log) {
                self.addChatLog(log, done);
            });
        }
    }
    setLogProp(log, displayMessage, callback) {
        log.setLastMessage(displayMessage);
        callback(log);
    }
    addChatLog(chatLog, done) {
        this.chatslog[chatLog.id] = chatLog;
        done();
    }
    checkRoomInfo(unread) {
        return new Promise((resolve, rejected) => {
            let roomInfo = this.dataManager.getGroup(unread.rid);
            if (!roomInfo) {
                console.warn("No have roomInfo in room store.", unread.rid);
                this.getRoomInfo(unread.rid, (err, room) => {
                    if (!!room) {
                        this.updatePersistRoomInfo(room);
                        this.organizeChatLogMap(unread, room, () => {
                            resolve();
                        });
                    }
                    else {
                        rejected();
                    }
                });
            }
            else {
                console.log("organize chats log of room: ", roomInfo.name);
                this.organizeChatLogMap(unread, roomInfo, () => {
                    resolve();
                });
            }
        });
    }
    getChatsLogCount() {
        return this.chatlog_count;
    }
    increaseChatsLogCount(num) {
        this.chatlog_count += num;
    }
    decreaseChatsLogCount(num) {
        this.chatlog_count -= num;
    }
    calculateChatsLogCount() {
        this.chatlog_count = 0;
        this.unreadMessageMap.forEach((value, key) => {
            let count = value.count;
            this.chatlog_count += count;
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatsLogComponent;
