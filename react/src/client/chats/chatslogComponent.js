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
const contactActions = require("../redux/app/contactActions");
const configureStore_1 = require("../redux/configureStore");
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
            // Provide chatslog service.
            self.chatListeners.map((v, i, a) => {
                v(decoded);
            });
        });
    }
    onAccessRoom(dataEvent) {
        let self = this;
        let roomAccess = dataEvent.roomAccess;
        const addRoomData = () => {
            async.map(roomAccess, function iterator(item, resultCallback) {
                self.getRoomInfo(item.roomId, (err, room) => {
                    if (err) {
                        resultCallback(null, null);
                    }
                    else {
                        self.dataManager.roomDAL.save(room._id, room);
                        resultCallback(null, null);
                    }
                });
            }, (err, results) => {
                done();
            });
        };
        const done = () => {
            self._isReady = true;
            if (!!self.onReady) {
                self.onReady();
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
        q.push(roomAccess, function (err) {
            if (!!err)
                console.error("getUnreadMessage err", err);
        });
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
        let token = configureStore_1.default.getState().authReducer.token;
        ServiceProvider.getRoomInfo(room_id, token).then(response => response.json()).then(function (json) {
            console.log("getRoomInfo result", json);
            if (json.success) {
                let roomInfos = JSON.parse(JSON.stringify(json.result));
                let room = self.decorateRoomInfoData(roomInfos[0]);
                callback(null, room);
            }
            else {
                callback(json.message, null);
            }
        }).catch(err => {
            console.warn("getRoomInfo fail: ", err);
            callback(err, null);
        });
    }
    getRoomsInfo() {
        let self = this;
        let results = new Array();
        // create a queue object with concurrency 2
        let q = async.queue(function (task, callback) {
            let value = task;
            self.dataManager.roomDAL.get(value.rid).then(roomInfo => {
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
        }, 10);
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
            }, 10);
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
                let contacts = yield contactActions.getContactProfile(unread.message.sender);
                let sender = (!!contacts && contacts.length > 0) ? contacts[0].username : "";
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
