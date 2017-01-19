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
const CryptoHelper = require("./utils/CryptoHelper");
const ServiceProvider = require("./services/ServiceProvider");
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
    onChat(message) {
        console.log("ChatsLogComponent.onChat");
        let self = this;
        CryptoHelper.decryptionText(message).then((decoded) => {
            //<!-- Provide chatslog service.
            self.chatListeners.map((v, i, a) => {
                v(decoded);
            });
        });
    }
    onAccessRoom(dataEvent) {
        let self = this;
        let roomAccess = dataEvent.roomAccess;
        /*
                let _rooms = new Map<string, DataModels.Room>();
                this.dataManager.roomDAL.getKeys().then(keys => {
                    async.map(keys, (room_id, cb) => {
                        this.dataManager.roomDAL.get(room_id).then((room: DataModels.Room) => {
                            _rooms.set(room_id, room);
                            cb(null, null);
                        });
                    }, (err, results) => {
                        addRoomData(_rooms);
                    });
                }).catch(err => {
                    done();
                });
        */
        const addRoomData = () => {
            async.map(roomAccess, function iterator(item, resultCallback) {
                self.getRoomInfo(item.roomId, (err, room) => {
                    if (err) {
                    }
                    else {
                        self.dataManager.roomDAL.save(room._id, room);
                    }
                    resultCallback(null, null);
                });
            }, (err, results) => {
                done();
            });
        };
        const done = () => {
            self._isReady = true;
            if (!!self.onReady)
                self.onReady();
        };
        addRoomData();
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
    getUnreadMessages(token, roomAccess, callback) {
        let self = this;
        let unreadLogs = new Array();
        async.mapSeries(roomAccess, function iterator(item, cb) {
            if (!!item.roomId && !!item.accessTime) {
                let msg = {};
                msg["token"] = token;
                msg["roomId"] = item.roomId;
                msg["lastAccessTime"] = item.accessTime.toString();
                ServiceProvider.getUnreadMessage(self.dataManager.getMyProfile()._id, item.roomId, item.accessTime.toString())
                    .then(response => response.json())
                    .then(value => {
                    console.log("getUnreadMessage: ", value);
                    if (value.success) {
                        let unread = JSON.parse(JSON.stringify(value.result));
                        unread.rid = item.roomId;
                        unreadLogs.push(unread);
                    }
                    cb(null, null);
                }).catch(err => {
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
        ServiceProvider.getUnreadMessage(this.dataManager.getMyProfile()._id, roomAccess.roomId, roomAccess.accessTime.toString())
            .then(response => response.json())
            .then(value => {
            console.log("getUnreadMessage", value);
            if (value.success) {
                let unread = JSON.parse(JSON.stringify(value.result));
                unread.rid = roomAccess.roomId;
                CryptoHelper.decryptionText(unread.message).then(decoded => {
                    callback(null, unread);
                }).catch(err => {
                    callback(null, unread);
                });
            }
            else {
                callback(value.message, null);
            }
        }).catch(err => {
            callback(err, null);
        });
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
        ServiceProvider.getRoomInfo(self.dataManager.getMyProfile()._id, room_id).then(response => response.json()).then(function (res) {
            console.log("getRoomInfo result", res);
            if (res.success) {
                let roomInfos = JSON.parse(JSON.stringify(res.result));
                let room = self.decorateRoomInfoData(roomInfos[0]);
                callback(null, room);
            }
            else {
                callback(res.message, null);
            }
        }).catch(err => {
            callback("Cannot get roomInfo" + err, null);
        });
    }
    getRoomsInfo() {
        let self = this;
        let results = new Array();
        // create a queue object with concurrency 2
        let q = async.queue(function (task, callback) {
            let value = task;
            self.dataManager.roomDAL.get(value.rid).then(roomInfo => {
                console.dir(roomInfo);
                if (!!roomInfo) {
                    let room = self.decorateRoomInfoData(roomInfo);
                    self.dataManager.roomDAL.save(room._id, room);
                    results.push(room);
                    callback();
                }
                else {
                    console.warn("Can't find roomInfo from persisted data: ", value.rid);
                    self.getRoomInfo(value.rid, (err, room) => {
                        if (!!room) {
                            self.dataManager.roomDAL.save(room._id, room);
                            results.push(room);
                            callback();
                        }
                        else {
                            callback(err);
                        }
                    });
                }
            });
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
                self.dataManager.roomDAL.get(unread.rid).then(room => {
                    if (!room)
                        callback();
                    self.organizeChatLogMap(unread, room, () => {
                        callback();
                    });
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
        let self = this;
        return new Promise((resolve, rejected) => {
            this.dataManager.roomDAL.get(unread.rid).then(roomInfo => {
                if (!roomInfo) {
                    console.warn("No have roomInfo in room store.", unread.rid);
                    this.getRoomInfo(unread.rid, (err, room) => {
                        if (!!room) {
                            self.dataManager.roomDAL.save(room._id, room);
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
