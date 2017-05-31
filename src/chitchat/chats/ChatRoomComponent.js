/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
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
var async = require("async");
var BackendFactory_1 = require("./BackendFactory");
var stalk_js_1 = require("stalk-js");
var CryptoHelper = require("./utils/CryptoHelper");
var chatroomService = require("./services/chatroomService");
var secureServiceFactory_1 = require("./secure/secureServiceFactory");
var Message_1 = require("../shared/Message");
var StickerPath_1 = require("../consts/StickerPath");
var ChitchatFactory_1 = require("./ChitchatFactory");
var getConfig = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var getStore = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().store; };
var ChatRoomComponent = (function () {
    function ChatRoomComponent() {
        this.secure = secureServiceFactory_1["default"].getService();
        this.chatRoomApi = BackendFactory_1.BackendFactory.getInstance().getChatApi();
        this.dataManager = BackendFactory_1.BackendFactory.getInstance().dataManager;
        this.dataListener = BackendFactory_1.BackendFactory.getInstance().dataListener;
        this.dataListener.addOnChatListener(this.onChat.bind(this));
    }
    ChatRoomComponent.getInstance = function () {
        if (!ChatRoomComponent.instance) {
            ChatRoomComponent.instance = new ChatRoomComponent();
        }
        return ChatRoomComponent.instance;
    };
    ChatRoomComponent.prototype.getRoomId = function () {
        return this.roomId;
    };
    ChatRoomComponent.prototype.setRoomId = function (rid) {
        this.roomId = rid;
    };
    ChatRoomComponent.prototype.onChat = function (message) {
        var _this = this;
        console.log("ChatRoomComponent.onChat");
        var self = this;
        var saveMessages = function (chatMessages) {
            chatMessages.push(message);
            self.dataManager.messageDAL.saveData(self.roomId, chatMessages).then(function (chats) {
                if (!!_this.chatroomDelegate) {
                    _this.chatroomDelegate(stalk_js_1.ChatEvents.ON_CHAT, message);
                }
            });
        };
        if (this.roomId === message.rid) {
            this.dataManager.messageDAL.getData(this.roomId).then(function (chats) {
                return chats;
            }).then(function (chats) {
                var chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array();
                if (message.type === Message_1.MessageType[Message_1.MessageType.Text]) {
                    CryptoHelper.decryptionText(message).then(function (decoded) {
                        saveMessages(chatMessages);
                    })["catch"](function (err) { return saveMessages(chatMessages); });
                }
                else if (message.type === Message_1.MessageType[Message_1.MessageType.Sticker]) {
                    var sticker_id = parseInt(message.body);
                    message.src = StickerPath_1.imagesPath[sticker_id].img;
                    saveMessages(chatMessages);
                }
                else {
                    saveMessages(chatMessages);
                }
            })["catch"](function (err) {
                console.error("Cannot get persistend message of room", err);
            });
        }
        else {
            console.info("this msg come from other room.");
            if (!!this.outsideRoomDelegete) {
                this.outsideRoomDelegete(stalk_js_1.ChatEvents.ON_CHAT, message);
            }
        }
    };
    ChatRoomComponent.prototype.onRoomJoin = function (data) { };
    ChatRoomComponent.prototype.onLeaveRoom = function (data) { };
    ChatRoomComponent.prototype.onMessageRead = function (dataEvent) {
        console.log("onMessageRead", JSON.stringify(dataEvent));
        var self = this;
        var newMsg = JSON.parse(JSON.stringify(dataEvent));
        var promise = new Promise(function (resolve, reject) {
            self.chatMessages.some(function callback(value) {
                if (value._id === newMsg._id) {
                    value.readers = newMsg.readers;
                    if (!!self.chatroomDelegate)
                        self.chatroomDelegate(stalk_js_1.ChatEvents.ON_MESSAGE_READ, null);
                    resolve();
                    return true;
                }
            });
        }).then(function (value) {
            self.dataManager.messageDAL.saveData(self.roomId, self.chatMessages);
        });
    };
    ChatRoomComponent.prototype.onGetMessagesReaders = function (dataEvent) {
        console.log("onGetMessagesReaders", dataEvent);
        var self = this;
        var myMessagesArr = JSON.parse(JSON.stringify(dataEvent.data));
        self.chatMessages.forEach(function (originalMsg, id, arr) {
            if (BackendFactory_1.BackendFactory.getInstance().dataManager.isMySelf(originalMsg.sender)) {
                myMessagesArr.some(function (myMsg, index, array) {
                    if (originalMsg._id === myMsg._id) {
                        originalMsg.readers = myMsg.readers;
                        return true;
                    }
                });
            }
        });
        self.dataManager.messageDAL.saveData(self.roomId, self.chatMessages);
    };
    ChatRoomComponent.prototype.getPersistentMessage = function (rid) {
        return __awaiter(this, void 0, void 0, function () {
            var self, messages, prom, chats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, self.dataManager.messageDAL.getData(rid)];
                    case 1:
                        messages = _a.sent();
                        if (!(messages && messages.length > 0)) return [3 /*break*/, 3];
                        prom = new Promise(function (resolve, reject) {
                            var chats = messages.slice(0);
                            async.forEach(chats, function iterator(chat, result) {
                                if (chat.type === Message_1.MessageType[Message_1.MessageType.Text]) {
                                    if (getConfig().appConfig.encryption === true) {
                                        self.secure.decryption(chat.body).then(function (res) {
                                            chat.body = res;
                                            result(null);
                                        })["catch"](function (err) { return result(null); });
                                    }
                                    else {
                                        result(null);
                                    }
                                }
                                else {
                                    result(null);
                                }
                            }, function (err) {
                                console.log("decoded chats completed.", chats.length);
                                self.dataManager.messageDAL.saveData(rid, chats);
                                resolve(chats);
                            });
                        });
                        return [4 /*yield*/, prom];
                    case 2:
                        chats = _a.sent();
                        return [2 /*return*/, chats];
                    case 3:
                        console.log("chatMessages is empty!");
                        return [2 /*return*/, new Array()];
                }
            });
        });
    };
    ChatRoomComponent.prototype.getNewerMessageRecord = function (sessionToken, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var self, lastMessageTime, getLastMessageTime, saveMergedMessage, getNewerMessage, messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        lastMessageTime = new Date();
                        getLastMessageTime = function (cb) {
                            var roomAccess = getStore().getState().chatlogReducer.roomAccess;
                            async.some(roomAccess, function (item, cb) {
                                if (item.roomId === self.roomId) {
                                    lastMessageTime = item.accessTime;
                                    cb(null, true);
                                }
                                else
                                    cb(null, false);
                            }, function (err, result) {
                                cb(result);
                            });
                        };
                        saveMergedMessage = function (histories) { return __awaiter(_this, void 0, void 0, function () {
                            var _results, results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _results = new Array();
                                        if (messages && messages.length > 0) {
                                            _results = messages.concat(histories);
                                        }
                                        else {
                                            _results = histories.slice();
                                        }
                                        return [4 /*yield*/, self.dataManager.messageDAL.saveData(self.roomId, _results)];
                                    case 1:
                                        results = _a.sent();
                                        callback(_results);
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        getNewerMessage = function () { return __awaiter(_this, void 0, void 0, function () {
                            var histories;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, self.getNewerMessageFromNet(lastMessageTime, sessionToken)];
                                    case 1:
                                        histories = _a.sent();
                                        saveMergedMessage(histories);
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, self.dataManager.messageDAL.getData(this.roomId)];
                    case 1:
                        messages = _a.sent();
                        if (messages && messages.length > 0) {
                            if (messages[messages.length - 1] != null) {
                                lastMessageTime = messages[messages.length - 1].createTime;
                                getNewerMessage();
                            }
                            else {
                                getLastMessageTime(function (boo) {
                                    getNewerMessage();
                                });
                            }
                        }
                        else {
                            getLastMessageTime(function (boo) {
                                getNewerMessage();
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatRoomComponent.prototype.getNewerMessageFromNet = function (lastMessageTime, sessionToken) {
        return __awaiter(this, void 0, void 0, function () {
            var self, response, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, chatroomService.getChatHistory(self.roomId, lastMessageTime, sessionToken)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        value = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                console.log("getChatHistory: ", value);
                                if (value.success) {
                                    var histories_1 = new Array();
                                    histories_1 = value.result;
                                    if (histories_1.length > 0) {
                                        async.forEach(histories_1, function (chat, cb) {
                                            if (chat.type === Message_1.MessageType[Message_1.MessageType.Text]) {
                                                if (getConfig().appConfig.encryption === true) {
                                                    self.secure.decryption(chat.body).then(function (res) {
                                                        chat.body = res;
                                                        cb(null);
                                                    })["catch"](function (err) {
                                                        cb(null);
                                                    });
                                                }
                                                else {
                                                    cb(null);
                                                }
                                            }
                                            else {
                                                cb(null);
                                            }
                                        }, function done(err) {
                                            if (!!err) {
                                                console.error("get newer message error", err);
                                                reject(err);
                                            }
                                            else {
                                                resolve(histories_1);
                                            }
                                        });
                                    }
                                    else {
                                        console.log("Have no newer message.");
                                        resolve(histories_1);
                                    }
                                }
                                else {
                                    console.warn("WTF god only know.", value.message);
                                    reject(value.message);
                                }
                            })];
                }
            });
        });
    };
    ChatRoomComponent.prototype.getOlderMessageChunk = function () {
        return __awaiter(this, void 0, void 0, function () {
            function waitForRoomMessages() {
                return __awaiter(this, void 0, void 0, function () {
                    var messages;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, self.dataManager.messageDAL.getData(self.roomId)];
                            case 1:
                                messages = _a.sent();
                                return [2 /*return*/, messages];
                        }
                    });
                });
            }
            function saveRoomMessages(merged) {
                return __awaiter(this, void 0, void 0, function () {
                    var value;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, self.dataManager.messageDAL.saveData(self.roomId, merged)];
                            case 1:
                                value = _a.sent();
                                return [2 /*return*/, value];
                        }
                    });
                });
            }
            var self, time, response, result, earlyMessages, persistMessages, mergedMessageArray_1, resultsArray_1, results, merged;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, self.getTopEdgeMessageTime()];
                    case 1:
                        time = _a.sent();
                        if (!time) return [3 /*break*/, 12];
                        return [4 /*yield*/, chatroomService.getOlderMessagesCount(self.roomId, time.toString(), true)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        result = _a.sent();
                        console.log("getOlderMessageChunk value", result);
                        if (!(result.success && result.result.length > 0)) return [3 /*break*/, 10];
                        earlyMessages = result.result;
                        return [4 /*yield*/, waitForRoomMessages()];
                    case 4:
                        persistMessages = _a.sent();
                        if (!(!!persistMessages && persistMessages.length > 0)) return [3 /*break*/, 7];
                        mergedMessageArray_1 = new Array();
                        mergedMessageArray_1 = earlyMessages.concat(persistMessages);
                        resultsArray_1 = new Array();
                        return [4 /*yield*/, new Promise(function (resolve, rejected) {
                                async.map(mergedMessageArray_1, function iterator(item, cb) {
                                    var hasMessage = resultsArray_1.some(function itor(value, id, arr) {
                                        if (!!value && value._id === item._id) {
                                            return true;
                                        }
                                    });
                                    if (hasMessage === false) {
                                        resultsArray_1.push(item);
                                        cb(null, null);
                                    }
                                    else {
                                        cb(null, null);
                                    }
                                }, function done(err, results) {
                                    var merged = resultsArray_1.sort(self.compareMessage);
                                    resolve(merged);
                                });
                            })];
                    case 5:
                        results = _a.sent();
                        return [4 /*yield*/, saveRoomMessages(results)];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7:
                        merged = earlyMessages.sort(self.compareMessage);
                        return [4 /*yield*/, saveRoomMessages(merged)];
                    case 8: return [2 /*return*/, _a.sent()];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, new Array()];
                    case 11: return [3 /*break*/, 13];
                    case 12: throw new Error("getTopEdgeMessageTime fail");
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    ChatRoomComponent.prototype.getTopEdgeMessageTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            function waitRoomMessage() {
                return __awaiter(this, void 0, void 0, function () {
                    var topEdgeMessageTime, messages;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                topEdgeMessageTime = new Date();
                                return [4 /*yield*/, self.dataManager.messageDAL.getData(self.roomId)];
                            case 1:
                                messages = _a.sent();
                                if (!!messages && messages.length > 0) {
                                    if (!!messages[0].createTime) {
                                        topEdgeMessageTime = messages[0].createTime;
                                    }
                                }
                                console.log("topEdgeMessageTime is: ", topEdgeMessageTime);
                                return [2 /*return*/, topEdgeMessageTime];
                        }
                    });
                });
            }
            var self;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        waitRoomMessage().then(function (topEdgeMessageTime) {
                            resolve(topEdgeMessageTime);
                        })["catch"](function (err) {
                            reject(err);
                        });
                    })];
            });
        });
    };
    ChatRoomComponent.prototype.compareMessage = function (a, b) {
        if (a.createTime > b.createTime) {
            return 1;
        }
        if (a.createTime < b.createTime) {
            return -1;
        }
        // a must be equal to b
        return 0;
    };
    ChatRoomComponent.prototype.updateReadMessages = function () {
        var self = this;
        async.map(self.chatMessages, function itorator(message, resultCb) {
            if (!BackendFactory_1.BackendFactory.getInstance().dataManager.isMySelf(message.sender)) {
                self.chatRoomApi.updateMessageReader(message._id, message.rid);
            }
            resultCb(null, null);
        }, function done(err) {
            // done.
        });
    };
    ChatRoomComponent.prototype.updateWhoReadMyMessages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        return [4 /*yield*/, self.getTopEdgeMessageTime()];
                    case 1:
                        res = _a.sent();
                        self.chatRoomApi.getMessagesReaders(res.toString());
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatRoomComponent.prototype.getMemberProfile = function (member, callback) {
        var server = BackendFactory_1.BackendFactory.getInstance().getServer();
        if (server)
            server.getMemberProfile(member._id, callback);
    };
    ChatRoomComponent.prototype.getMessages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataManager.messageDAL.getData(this.roomId)];
                    case 1:
                        messages = _a.sent();
                        return [2 /*return*/, messages];
                }
            });
        });
    };
    ChatRoomComponent.prototype.dispose = function () {
        this.dataListener.removeOnChatListener(this.onChat.bind(this));
        ChatRoomComponent.instance = null;
    };
    return ChatRoomComponent;
}());
exports.ChatRoomComponent = ChatRoomComponent;
