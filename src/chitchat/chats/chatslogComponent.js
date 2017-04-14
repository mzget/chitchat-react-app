"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
const async = require("async");
const chatLog_1 = require("./models/chatLog");
const BackendFactory_1 = require("./BackendFactory");
const CryptoHelper = require("./utils/CryptoHelper");
const Message_1 = require("../libs/shared/Message");
const Room_1 = require("../libs/shared/Room");
const ServiceProvider = require("./services/ServiceProvider");
const chatlogActionsHelper = require("./redux/chatlogs/chatlogActionsHelper");
class Unread {
}
exports.Unread = Unread;
class ChatsLogComponent {
    constructor() {
        this.serverImp = null;
        this.dataManager = null;
        this.dataListener = null;
        this.chatlog_count = 0;
        this.chatslog = new Map();
        this.unreadMessageMap = new Map();
        this.chatListeners = new Array();
        this._isReady = false;
        this.dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
        this.dataListener = BackendFactory_1.BackendFactory.getInstance().dataListener;
        this.dataListener.addOnRoomAccessListener(this.onAccessRoom.bind(this));
        this.dataListener.addOnChatListener(this.onChat.bind(this));
        this.dataListener.addOnAddRoomAccessListener(this.onAddRoomAccess.bind(this));
        this.dataListener.addOnUpdateRoomAccessListener(this.onUpdatedLastAccessTime.bind(this));
        BackendFactory_1.BackendFactory.getInstance().getServer().then(server => {
            this.serverImp = server;
        }).catch(err => {
            console.log(err);
        });
        console.log("ChatsLogComponent : constructor");
    }
    getChatsLog() {
        return Array.from(this.chatslog.values());
    }
    getUnreadMessageMap() {
        return this.unreadMessageMap;
    }
    setUnreadMessageMap(unreads) {
        unreads.map(v => {
            this.unreadMessageMap.set(v.rid, v);
        });
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
            // Provide chatslog service.
            self.chatListeners.map((v, i, a) => {
                v(decoded);
            });
        });
    }
    onAccessRoom(dataEvent) {
        let self = this;
        this.unreadMessageMap.clear();
        this.chatslog.clear();
        let roomAccess = dataEvent.roomAccess;
        let results = new Array();
        const addRoomData = () => {
            async.map(roomAccess, function iterator(item, resultCallback) {
                self.getRoomInfo(item.roomId, (err, room) => {
                    if (!!room) {
                        results.push(room);
                        resultCallback(null, room);
                    }
                    else {
                        resultCallback(null, null);
                    }
                });
            }, (err, results) => {
                console.log("onAccessRoom.finished!");
                done();
            });
        };
        const done = () => {
            self._isReady = true;
            if (!!self.onReady) {
                self.onReady(results);
            }
        };
        addRoomData();
    }
    onUpdatedLastAccessTime(dataEvent) {
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
    getUnreadMessages(user_id, roomAccess, callback) {
        let self = this;
        let unreadLogs = new Array();
        // create a queue object with concurrency 2
        let q = async.queue(function (task, callback) {
            if (!!task.roomId && !!task.accessTime) {
                self.getUnreadMessage(user_id, task).then(value => {
                    unreadLogs.push(value);
                    callback();
                }).catch(err => {
                    callback();
                });
            }
            else {
                callback();
            }
        }, 10);
        // assign a callback
        q.drain = function () {
            console.log("getUnreadMessages from your roomAccess is done.");
            callback(null, unreadLogs);
        };
        // add some items to the queue (batch-wise)
        if (roomAccess && roomAccess.length > 0) {
            q.push(roomAccess, function (err) {
                if (!!err)
                    console.error("getUnreadMessage err", err);
            });
        }
        else {
            callback(null, null);
        }
    }
    getUnreadMessage(user_id, roomAccess) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield ServiceProvider.getUnreadMessage(roomAccess.roomId, user_id, roomAccess.accessTime.toString());
            let value = yield response.json();
            console.log("getUnreadMessage result: ", value);
            if (value.success) {
                let unread = value.result;
                unread.rid = roomAccess.roomId;
                let decoded = yield CryptoHelper.decryptionText(unread.message);
                return unread;
            }
            else {
                throw new Error(value.message);
            }
        });
    }
    decorateRoomInfoData(roomInfo) {
        if (roomInfo.type == Room_1.RoomType.privateChat) {
            if (Array.isArray(roomInfo.members)) {
                let others = roomInfo.members.filter((value) => !this.dataManager.isMySelf(value._id));
                if (others.length > 0) {
                    let contact = others[0];
                    roomInfo.name = (contact.username) ? contact.username : "EMPTY ROOM";
                    roomInfo.image = (contact.avatar) ? contact.avatar : null;
                }
            }
        }
        return roomInfo;
    }
    getRoomInfo(room_id, callback) {
        let self = this;
        ServiceProvider.getRoomInfo(room_id)
            .then(response => response.json())
            .then(function (json) {
            console.log("getRoomInfo value:", json);
            if (json.success) {
                let roomInfos = json.result;
                let room = self.decorateRoomInfoData(roomInfos[0]);
                callback(null, room);
            }
            else {
                callback(json.message, null);
            }
        }).catch(err => {
            callback(err, null);
        });
    }
    getRoomsInfo(user_id, chatrooms) {
        let self = this;
        // create a queue object with concurrency 2
        let q = async.queue(function (task, callback) {
            let value = task;
            let rooms = chatrooms.filter(v => v._id == value.rid);
            let roomInfo = (rooms.length > 0) ? rooms[0] : null;
            if (!!roomInfo) {
                let room = self.decorateRoomInfoData(roomInfo);
                chatrooms.forEach(v => {
                    if (v._id == room._id) {
                        v = room;
                    }
                });
                self.organizeChatLogMap(value, room, function done() {
                    callback();
                });
            }
            else {
                console.log("Can't find roomInfo from persisted data: ", value.rid);
                self.getRoomInfo(value.rid, (err, room) => {
                    if (!!room) {
                        chatrooms.forEach(v => {
                            if (v._id == room._id) {
                                v = room;
                            }
                        });
                        self.organizeChatLogMap(value, room, function done() {
                            callback();
                        });
                    }
                    else {
                        console.warn(err);
                        callback();
                    }
                });
            }
        }, 10);
        // assign a callback
        q.drain = function () {
            console.log("getRoomsInfo Completed.");
            if (self.getRoomsInfoCompleteEvent())
                self.getRoomsInfoCompleteEvent();
        };
        this.unreadMessageMap.forEach((value, key, map) => {
            // add some items to the queue
            q.push(value, function (err) { });
        });
    }
    manageChatLog(chatrooms) {
        let self = this;
        return new Promise((resolve, rejected) => {
            // create a queue object with concurrency 2
            let q = async.queue(function (task, callback) {
                let unread = task;
                let rooms = chatrooms.filter(v => v._id == unread.rid);
                let room = (rooms.length > 0) ? rooms[0] : null;
                if (!room) {
                    callback();
                }
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
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let log = new chatLog_1.default(roomInfo);
            log.setNotiCount(unread.count);
            if (!!unread.message) {
                log.setLastMessageTime(unread.message.createTime.toString());
                let contact = yield chatlogActionsHelper.getContactProfile(unread.message.sender);
                let sender = (!!contact) ? contact.displayname : "";
                if (unread.message.body != null) {
                    let displayMsg = unread.message.body;
                    switch (`${unread.message.type}`) {
                        case Message_1.MessageType[Message_1.MessageType.Text]:
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
                        case Message_1.MessageType[Message_1.MessageType.Sticker]:
                            displayMsg = sender + " sent a sticker.";
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case Message_1.MessageType[Message_1.MessageType.Voice]:
                            displayMsg = sender + " sent a voice message.";
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case Message_1.MessageType[Message_1.MessageType.Image]:
                            displayMsg = sender + " sent a image.";
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case Message_1.MessageType[Message_1.MessageType.Video]:
                            displayMsg = sender + " sent a video.";
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case Message_1.MessageType[Message_1.MessageType.Location]:
                            displayMsg = sender + " sent a location.";
                            self.setLogProp(log, displayMsg, function (log) {
                                self.addChatLog(log, done);
                            });
                            break;
                        case Message_1.MessageType[Message_1.MessageType.File]:
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
        });
    }
    setLogProp(log, displayMessage, callback) {
        log.setLastMessage(displayMessage);
        callback(log);
    }
    addChatLog(chatLog, done) {
        this.chatslog.set(chatLog.id, chatLog);
        done();
    }
    checkRoomInfo(unread, chatrooms) {
        let self = this;
        return new Promise((resolve, rejected) => {
            let rooms = (!!chatrooms && chatrooms.length > 0) ? chatrooms.filter(v => v._id == unread.rid) : [];
            let roomInfo = rooms[0];
            if (!roomInfo) {
                console.warn("No have roomInfo in room store.", unread.rid);
                this.getRoomInfo(unread.rid, (err, room) => {
                    if (!!room) {
                        this.organizeChatLogMap(unread, room, () => {
                            resolve(room);
                        });
                    }
                    else {
                        rejected(err);
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
exports.ChatsLogComponent = ChatsLogComponent;
