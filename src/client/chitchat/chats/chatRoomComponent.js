/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as async from "async";
import { BackendFactory } from "./BackendFactory";
import { ServerImplemented, ChatRoom } from "stalk-js";
import * as CryptoHelper from "./utils/CryptoHelper";
import * as chatroomService from "./services/chatroomService";
import SecureServiceFactory from "./secure/secureServiceFactory";
import { MessageType } from "../shared/Message";
import { imagesPath } from "../consts/StickerPath";
import { ChitChatFactory } from "./chitchatFactory";
const getConfig = () => ChitChatFactory.getInstance().config;
const getStore = () => ChitChatFactory.getInstance().store;
import { ServerEventListener } from "./ServerEventListener";
const ChatRoomApiProvider = ChatRoom;
let serverImp = null;
export default class ChatRoomComponent {
    static getInstance() {
        if (!ChatRoomComponent.instance) {
            ChatRoomComponent.instance = new ChatRoomComponent();
        }
        return ChatRoomComponent.instance;
    }
    getRoomId() {
        return this.roomId;
    }
    setRoomId(rid) {
        this.roomId = rid;
    }
    constructor() {
        this.secure = SecureServiceFactory.getService();
        this.chatRoomApi = BackendFactory.getInstance().getChatApi();
        BackendFactory.getInstance().getServer().then(server => {
            serverImp = server;
        }).catch(err => {
        });
        this.dataManager = BackendFactory.getInstance().dataManager;
        this.dataListener = BackendFactory.getInstance().dataListener;
        this.dataListener.addOnChatListener(this.onChat.bind(this));
    }
    onChat(message) {
        console.log("ChatRoomComponent.onChat");
        let self = this;
        const saveMessages = (chatMessages) => {
            chatMessages.push(message);
            self.dataManager.messageDAL.saveData(self.roomId, chatMessages).then(chats => {
                if (!!this.chatroomDelegate) {
                    this.chatroomDelegate(ServerEventListener.ON_CHAT, message);
                }
            });
        };
        if (this.roomId === message.rid) {
            this.dataManager.messageDAL.getData(this.roomId).then((chats) => {
                return chats;
            }).then((chats) => {
                let chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array();
                if (message.type === MessageType[MessageType.Text]) {
                    CryptoHelper.decryptionText(message).then(decoded => {
                        saveMessages(chatMessages);
                    }).catch(err => saveMessages(chatMessages));
                }
                else if (message.type === MessageType[MessageType.Sticker]) {
                    let sticker_id = parseInt(message.body);
                    message.src = imagesPath[sticker_id].img;
                    saveMessages(chatMessages);
                }
                else {
                    saveMessages(chatMessages);
                }
            }).catch(err => {
                console.error("Cannot get persistend message of room", err);
            });
        }
        else {
            console.info("this msg come from other room.");
            if (!!this.outsideRoomDelegete) {
                this.outsideRoomDelegete(ServerEventListener.ON_CHAT, message);
            }
        }
    }
    onRoomJoin(data) { }
    onLeaveRoom(data) { }
    onMessageRead(dataEvent) {
        console.log("onMessageRead", JSON.stringify(dataEvent));
        let self = this;
        let newMsg = JSON.parse(JSON.stringify(dataEvent));
        let promise = new Promise(function (resolve, reject) {
            self.chatMessages.some(function callback(value) {
                if (value._id === newMsg._id) {
                    value.readers = newMsg.readers;
                    if (!!self.chatroomDelegate)
                        self.chatroomDelegate(ServerEventListener.ON_MESSAGE_READ, null);
                    resolve();
                    return true;
                }
            });
        }).then((value) => {
            self.dataManager.messageDAL.saveData(self.roomId, self.chatMessages);
        });
    }
    onGetMessagesReaders(dataEvent) {
        console.log("onGetMessagesReaders", dataEvent);
        let self = this;
        let myMessagesArr = JSON.parse(JSON.stringify(dataEvent.data));
        self.chatMessages.forEach((originalMsg, id, arr) => {
            if (BackendFactory.getInstance().dataManager.isMySelf(originalMsg.sender)) {
                myMessagesArr.some((myMsg, index, array) => {
                    if (originalMsg._id === myMsg._id) {
                        originalMsg.readers = myMsg.readers;
                        return true;
                    }
                });
            }
        });
        self.dataManager.messageDAL.saveData(self.roomId, self.chatMessages);
    }
    getPersistentMessage(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let messages = yield self.dataManager.messageDAL.getData(rid);
            if (messages && messages.length > 0) {
                let prom = new Promise((resolve, reject) => {
                    let chats = messages.slice(0);
                    async.forEach(chats, function iterator(chat, result) {
                        if (chat.type === MessageType[MessageType.Text]) {
                            if (getConfig().appConfig.encryption === true) {
                                self.secure.decryption(chat.body).then(function (res) {
                                    chat.body = res;
                                    result(null);
                                }).catch(err => result(null));
                            }
                            else {
                                result(null);
                            }
                        }
                        else {
                            result(null);
                        }
                    }, (err) => {
                        console.log("decoded chats completed.", chats.length);
                        self.dataManager.messageDAL.saveData(rid, chats);
                        resolve(chats);
                    });
                });
                let chats = yield prom;
                return chats;
            }
            else {
                console.log("chatMessages is empty!");
                return new Array();
            }
        });
    }
    getNewerMessageRecord(sessionToken, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let lastMessageTime = new Date();
            const getLastMessageTime = (cb) => {
                let { roomAccess } = getStore().getState().chatlogReducer;
                async.some(roomAccess, (item, cb) => {
                    if (item.roomId === self.roomId) {
                        lastMessageTime = item.accessTime;
                        cb(null, true);
                    }
                    else
                        cb(null, false);
                }, (err, result) => {
                    cb(result);
                });
            };
            const saveMergedMessage = (histories) => __awaiter(this, void 0, void 0, function* () {
                let _results = new Array();
                if (messages && messages.length > 0) {
                    _results = messages.concat(histories);
                }
                else {
                    _results = histories.slice();
                }
                // Save persistent chats log here.
                let results = yield self.dataManager.messageDAL.saveData(self.roomId, _results);
                callback(_results);
            });
            const getNewerMessage = () => __awaiter(this, void 0, void 0, function* () {
                let histories = yield self.getNewerMessageFromNet(lastMessageTime, sessionToken);
                saveMergedMessage(histories);
            });
            let messages = yield self.dataManager.messageDAL.getData(this.roomId);
            if (messages && messages.length > 0) {
                if (messages[messages.length - 1] != null) {
                    lastMessageTime = messages[messages.length - 1].createTime;
                    getNewerMessage();
                }
                else {
                    getLastMessageTime((boo) => {
                        getNewerMessage();
                    });
                }
            }
            else {
                getLastMessageTime((boo) => {
                    getNewerMessage();
                });
            }
        });
    }
    getNewerMessageFromNet(lastMessageTime, sessionToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let response = yield chatroomService.getChatHistory(self.roomId, lastMessageTime, sessionToken);
            let value = yield response.json();
            return new Promise((resolve, reject) => {
                console.log("getChatHistory: ", value);
                if (value.success) {
                    let histories = new Array();
                    histories = value.result;
                    if (histories.length > 0) {
                        async.forEach(histories, function (chat, cb) {
                            if (chat.type === MessageType[MessageType.Text]) {
                                if (getConfig().appConfig.encryption === true) {
                                    self.secure.decryption(chat.body).then(function (res) {
                                        chat.body = res;
                                        cb(null);
                                    }).catch(err => {
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
                                resolve(histories);
                            }
                        });
                    }
                    else {
                        console.log("Have no newer message.");
                        resolve(histories);
                    }
                }
                else {
                    console.warn("WTF god only know.", value.message);
                    reject(value.message);
                }
            });
        });
    }
    getOlderMessageChunk() {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            function waitForRoomMessages() {
                return __awaiter(this, void 0, void 0, function* () {
                    let messages = yield self.dataManager.messageDAL.getData(self.roomId);
                    return messages;
                });
            }
            function saveRoomMessages(merged) {
                return __awaiter(this, void 0, void 0, function* () {
                    let value = yield self.dataManager.messageDAL.saveData(self.roomId, merged);
                    return value;
                });
            }
            let time = yield self.getTopEdgeMessageTime();
            if (time) {
                let response = yield chatroomService.getOlderMessagesCount(self.roomId, time.toString(), true);
                let result = yield response.json();
                console.log("getOlderMessageChunk value", result);
                // todo
                /**
                 * Merge messages record to chatMessages array.
                 * Never save message to persistend layer.
                 */
                if (result.success && result.result.length > 0) {
                    let earlyMessages = result.result;
                    let persistMessages = yield waitForRoomMessages();
                    if (!!persistMessages && persistMessages.length > 0) {
                        let mergedMessageArray = new Array();
                        mergedMessageArray = earlyMessages.concat(persistMessages);
                        let resultsArray = new Array();
                        let results = yield new Promise((resolve, rejected) => {
                            async.map(mergedMessageArray, function iterator(item, cb) {
                                let hasMessage = resultsArray.some(function itor(value, id, arr) {
                                    if (!!value && value._id === item._id) {
                                        return true;
                                    }
                                });
                                if (hasMessage === false) {
                                    resultsArray.push(item);
                                    cb(null, null);
                                }
                                else {
                                    cb(null, null);
                                }
                            }, function done(err, results) {
                                let merged = resultsArray.sort(self.compareMessage);
                                resolve(merged);
                            });
                        });
                        return yield saveRoomMessages(results);
                    }
                    else {
                        let merged = earlyMessages.sort(self.compareMessage);
                        return yield saveRoomMessages(merged);
                    }
                }
                else {
                    return new Array();
                }
            }
            else {
                throw new Error("getTopEdgeMessageTime fail");
            }
        });
    }
    getTopEdgeMessageTime() {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            function waitRoomMessage() {
                return __awaiter(this, void 0, void 0, function* () {
                    let topEdgeMessageTime = new Date();
                    let messages = yield self.dataManager.messageDAL.getData(self.roomId);
                    if (!!messages && messages.length > 0) {
                        if (!!messages[0].createTime) {
                            topEdgeMessageTime = messages[0].createTime;
                        }
                    }
                    console.log("topEdgeMessageTime is: ", topEdgeMessageTime);
                    return topEdgeMessageTime;
                });
            }
            return new Promise((resolve, reject) => {
                waitRoomMessage().then((topEdgeMessageTime) => {
                    resolve(topEdgeMessageTime);
                }).catch(err => {
                    reject(err);
                });
            });
        });
    }
    compareMessage(a, b) {
        if (a.createTime > b.createTime) {
            return 1;
        }
        if (a.createTime < b.createTime) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }
    updateReadMessages() {
        let self = this;
        async.map(self.chatMessages, function itorator(message, resultCb) {
            if (!BackendFactory.getInstance().dataManager.isMySelf(message.sender)) {
                self.chatRoomApi.updateMessageReader(message._id, message.rid);
            }
            resultCb(null, null);
        }, function done(err) {
            // done.
        });
    }
    updateWhoReadMyMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            let res = yield self.getTopEdgeMessageTime();
            self.chatRoomApi.getMessagesReaders(res.toString());
        });
    }
    getMemberProfile(member, callback) {
        ServerImplemented.getInstance().getMemberProfile(member._id, callback);
    }
    getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            let messages = yield this.dataManager.messageDAL.getData(this.roomId);
            return messages;
        });
    }
    dispose() {
        this.dataListener.removeOnChatListener(this.onChat.bind(this));
        ChatRoomComponent.instance = null;
    }
}
