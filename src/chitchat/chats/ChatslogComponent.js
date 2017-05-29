"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
var async = require("async");
var ChitchatFactory_1 = require("./ChitchatFactory");
var authReducer = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().authStore; };
var chatLog_1 = require("./models/chatLog");
var BackendFactory_1 = require("./BackendFactory");
var CryptoHelper = require("./utils/CryptoHelper");
var Message_1 = require("../shared/Message");
var Room_1 = require("../shared/Room");
var chatroomService = require("./services/chatroomService");
var chatlogActionsHelper = require("./redux/chatlogs/chatlogActionsHelper");
var Unread = (function () {
    function Unread() {
    }
    return Unread;
}());
exports.Unread = Unread;
var ChatsLogComponent = (function () {
    function ChatsLogComponent() {
        this.chatlog_count = 0;
        this.chatslog = new Map();
        this.unreadMessageMap = new Map();
        this.chatListeners = new Array();
        this._isReady = false;
        var backendFactory = BackendFactory_1.BackendFactory.getInstance();
        this.dataListener = backendFactory.dataListener;
        this.dataListener.addOnRoomAccessListener(this.onAccessRoom.bind(this));
        this.dataListener.addOnChatListener(this.onChat.bind(this));
        this.dataListener.addOnAddRoomAccessListener(this.onAddRoomAccess.bind(this));
        this.dataListener.addOnUpdateRoomAccessListener(this.onUpdatedLastAccessTime.bind(this));
    }
    ChatsLogComponent.prototype.getChatsLog = function () {
        return Array.from(this.chatslog.values());
    };
    ChatsLogComponent.prototype.getUnreadMessageMap = function () {
        return this.unreadMessageMap;
    };
    ChatsLogComponent.prototype.setUnreadMessageMap = function (unreads) {
        var _this = this;
        unreads.map(function (v) {
            _this.unreadMessageMap.set(v.rid, v);
        });
    };
    ChatsLogComponent.prototype.addUnreadMessage = function (unread) {
        this.unreadMessageMap.set(unread.rid, unread);
    };
    ChatsLogComponent.prototype.getUnreadItem = function (room_id) {
        return this.unreadMessageMap.get(room_id);
    };
    ChatsLogComponent.prototype.onUpdatedLastAccessTime = function (data) {
        if (!!this.updatedLastAccessTimeEvent) {
            this.updatedLastAccessTimeEvent(data);
        }
    };
    ChatsLogComponent.prototype.addOnChatListener = function (listener) {
        this.chatListeners.push(listener);
    };
    ChatsLogComponent.prototype.onChat = function (message) {
        console.log("ChatsLogComponent.onChat");
        var self = this;
        CryptoHelper.decryptionText(message).then(function (decoded) {
            // Provide chatslog service.
            self.chatListeners.map(function (v, i, a) {
                v(decoded);
            });
        });
    };
    ChatsLogComponent.prototype.onAccessRoom = function (dataEvent) {
        var self = this;
        this.unreadMessageMap.clear();
        this.chatslog.clear();
        var roomAccess = dataEvent.roomAccess;
        var results = new Array();
        var done = function () {
            self._isReady = true;
            if (!!self.onReady) {
                self.onReady(results);
            }
        };
        async.each(roomAccess, function (item, resultCallback) {
            self.getRoomInfo(item.roomId)
                .then(function (room) {
                    results.push(room);
                    resultCallback();
                })["catch"](function (err) {
                    if (err)
                        console.warn("getRoomInfo", err);
                    resultCallback();
                });
        }, function (err) {
            console.log("onAccessRoom.finished!", err);
            done();
        });
    };
    ChatsLogComponent.prototype.onAddRoomAccess = function (dataEvent) {
        console.warn("ChatsLogComponent.onAddRoomAccess", JSON.stringify(dataEvent));
        if (!!this.addNewRoomAccessEvent) {
            this.addNewRoomAccessEvent(dataEvent);
        }
    };
    ChatsLogComponent.prototype.getUnreadMessages = function (user_id, roomAccess, callback) {
        var self = this;
        var unreadLogs = new Array();
        // create a queue object with concurrency 2
        var q = async.queue(function (task, callback) {
            if (!!task.roomId && !!task.accessTime) {
                self.getUnreadMessage(user_id, task).then(function (value) {
                    unreadLogs.push(value);
                    callback();
                })["catch"](function (err) {
                    if (err)
                        console.warn("getUnreadMessage", err);
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
    };
    ChatsLogComponent.prototype.getUnreadMessage = function (user_id, roomAccess) {
        return __awaiter(this, void 0, void 0, function () {
            var response, value, unread, decoded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chatroomService.getUnreadMessage(roomAccess.roomId, user_id, roomAccess.accessTime.toString())];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        value = _a.sent();
                        console.log("getUnreadMessage result: ", value);
                        if (!value.success) return [3 /*break*/, 4];
                        unread = value.result;
                        unread.rid = roomAccess.roomId;
                        return [4 /*yield*/, CryptoHelper.decryptionText(unread.message)];
                    case 3:
                        decoded = _a.sent();
                        return [2 /*return*/, unread];
                    case 4: throw new Error(value.message);
                }
            });
        });
    };
    ChatsLogComponent.prototype.decorateRoomInfoData = function (roomInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var others, contact, avatar, user, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(roomInfo.type == Room_1.RoomType.privateChat)) return [3 /*break*/, 5];
                        if (!Array.isArray(roomInfo.members)) return [3 /*break*/, 5];
                        others = roomInfo.members.filter(function (value) {
                            return value._id != authReducer().user._id;
                        });
                        if (!(others.length > 0)) return [3 /*break*/, 5];
                        contact = others[0];
                        avatar = null;
                        if (!!contact.avatar) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, chatlogActionsHelper.getContactProfile(contact._id)];
                    case 2:
                        user = _a.sent();
                        avatar = user.avatar;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        if (err_1)
                            console.warn("getContactProfile fail", err_1);
                        return [3 /*break*/, 4];
                    case 4:
                        roomInfo.name = (contact.username) ? contact.username : "EMPTY ROOM";
                        roomInfo.image = (contact.avatar) ? contact.avatar : avatar;
                        _a.label = 5;
                    case 5: return [2 /*return*/, roomInfo];
                }
            });
        });
    };
    ChatsLogComponent.prototype.getRoomInfo = function (room_id) {
        return __awaiter(this, void 0, void 0, function () {
            var self, response, json, roomInfos, room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, chatroomService.getRoomInfo(room_id)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        console.log("getRoomInfo value:", json);
                        if (!json.success) return [3 /*break*/, 4];
                        roomInfos = json.result;
                        return [4 /*yield*/, self.decorateRoomInfoData(roomInfos[0])];
                    case 3:
                        room = _a.sent();
                        return [2 /*return*/, room];
                    case 4: throw new Error(json.message);
                }
            });
        });
    };
    ChatsLogComponent.prototype.getRoomsInfo = function (user_id, chatrooms) {
        var self = this;
        // create a queue object with concurrency 2
        var q = async.queue(function (task, callback) {
            var value = task;
            var rooms = chatrooms.filter(function (v) { return v._id == value.rid; });
            var roomInfo = (rooms.length > 0) ? rooms[0] : null;
            if (!!roomInfo) {
                self.decorateRoomInfoData(roomInfo).then(function (room) {
                    chatrooms.forEach(function (v) {
                        if (v._id == room._id) {
                            v = room;
                        }
                    });
                    self.organizeChatLogMap(value, room, function done() {
                        callback();
                    });
                })["catch"](function (err) {
                    callback();
                });
            }
            else {
                console.log("Can't find roomInfo from persisted data: ", value.rid);
                self.getRoomInfo(value.rid).then(function (room) {
                    chatrooms.forEach(function (v) {
                        if (v._id == room._id) {
                            v = room;
                        }
                    });
                    self.organizeChatLogMap(value, room, function done() {
                        callback();
                    });
                })["catch"](function (err) {
                    console.warn(err);
                    callback();
                });
            }
        }, 10);
        // assign a callback
        q.drain = function () {
            console.log("getRoomsInfo Completed.");
            if (self.getRoomsInfoCompleteEvent())
                self.getRoomsInfoCompleteEvent();
        };
        this.unreadMessageMap.forEach(function (value, key, map) {
            // add some items to the queue
            q.push(value, function (err) { });
        });
    };
    ChatsLogComponent.prototype.manageChatLog = function (chatrooms) {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, rejected) {
            // create a queue object with concurrency 2
            var q = async.queue(function (task, callback) {
                var unread = task;
                var rooms = chatrooms.filter(function (v) { return v._id == unread.rid; });
                var room = (rooms.length > 0) ? rooms[0] : null;
                if (!room) {
                    callback();
                }
                self.organizeChatLogMap(unread, room, function () {
                    callback();
                });
            }, 2);
            // assign a callback
            q.drain = function () {
                resolve(self.chatslog);
            };
            _this.unreadMessageMap.forEach(function (value, key, map) {
                // add some items to the queue
                q.push(value, function (err) { });
            });
        });
    };
    ChatsLogComponent.prototype.organizeChatLogMap = function (unread, roomInfo, done) {
        return __awaiter(this, void 0, void 0, function () {
            var self, log, contact, err_2, sender, displayMsg, displayMsg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        log = new chatLog_1["default"](roomInfo);
                        log.setNotiCount(unread.count);
                        if (!!!unread.message) return [3 /*break*/, 5];
                        log.setLastMessageTime(unread.message.createTime.toString());
                        contact = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, chatlogActionsHelper.getContactProfile(unread.message.sender)];
                    case 2:
                        contact = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        if (err_2)
                            console.warn("get sender contact fail", err_2);
                        return [3 /*break*/, 4];
                    case 4:
                        sender = (!!contact) ? contact.username : "";
                        if (unread.message.body != null) {
                            displayMsg = unread.message.body;
                            switch ("" + unread.message.type) {
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
                        return [3 /*break*/, 6];
                    case 5:
                        displayMsg = "Start Chatting Now!";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChatsLogComponent.prototype.setLogProp = function (log, displayMessage, callback) {
        log.setLastMessage(displayMessage);
        callback(log);
    };
    ChatsLogComponent.prototype.addChatLog = function (chatLog, done) {
        this.chatslog.set(chatLog.id, chatLog);
        done();
    };
    ChatsLogComponent.prototype.checkRoomInfo = function (unread, chatrooms) {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, rejected) {
            var rooms = (!!chatrooms && chatrooms.length > 0) ? chatrooms.filter(function (v) { return v._id == unread.rid; }) : [];
            var roomInfo = rooms[0];
            if (!roomInfo) {
                console.warn("No have roomInfo in room store.", unread.rid);
                self.getRoomInfo(unread.rid).then(function (room) {
                    _this.organizeChatLogMap(unread, room, function () {
                        resolve(room);
                    });
                })["catch"](function (err) {
                    if (err)
                        console.warn("getRoomInfo fail", err);
                    rejected(err);
                });
            }
            else {
                console.log("organize chats log of room: ", roomInfo.name);
                _this.organizeChatLogMap(unread, roomInfo, function () {
                    resolve();
                });
            }
        });
    };
    ChatsLogComponent.prototype.getChatsLogCount = function () {
        return this.chatlog_count;
    };
    ChatsLogComponent.prototype.increaseChatsLogCount = function (num) {
        this.chatlog_count += num;
    };
    ChatsLogComponent.prototype.decreaseChatsLogCount = function (num) {
        this.chatlog_count -= num;
    };
    ChatsLogComponent.prototype.calculateChatsLogCount = function () {
        var _this = this;
        this.chatlog_count = 0;
        this.unreadMessageMap.forEach(function (value, key) {
            var count = value.count;
            _this.chatlog_count += count;
        });
    };
    return ChatsLogComponent;
}());
exports.ChatsLogComponent = ChatsLogComponent;
