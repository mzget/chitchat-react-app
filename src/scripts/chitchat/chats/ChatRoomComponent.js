/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
import * as async from "async";
import * as Rx from "rxjs";
import { ChatEvents } from "stalk-js";
import { BackendFactory } from "./BackendFactory";
import * as CryptoHelper from "./utils/CryptoHelper";
import * as chatroomService from "./services/chatroomService";
import { MessageType } from "../shared/";
import { imagesPath } from "../consts/StickerPath";
import { ChitChatFactory } from "./ChitChatFactory";
const getConfig = () => ChitChatFactory.getInstance().config;
const getStore = () => ChitChatFactory.getInstance().store;
export const ON_MESSAGE_CHANGE = "ON_MESSAGE_CHANGE";
export function getStickerPath(message) {
    let sticker_id = parseInt(message.body);
    message["src"] = imagesPath[sticker_id].img;
    return message;
}
class ChatRoomComponent {
    constructor() {
        this.updateMessageQueue = new Array();
        this.saveMessages = (chatMessages, message) => {
            let self = this;
            chatMessages.push(message);
            self.save(self.roomId, chatMessages).then(chats => {
                if (!!self.chatroomDelegate) {
                    self.chatroomDelegate(ChatEvents.ON_CHAT, message);
                    self.chatroomDelegate(ON_MESSAGE_CHANGE, chatMessages);
                }
            });
        };
        console.log("ChatRoomComponent: constructor");
        this.dataManager = BackendFactory.getInstance().dataManager;
        this.dataListener = BackendFactory.getInstance().dataListener;
        this.dataListener.addOnChatListener(this.onChat.bind(this));
        const source = Rx.Observable.timer(1000, 1000);
        const subscribe = source.subscribe(val => {
            if (this.updateMessageQueue.length > 0) {
                let queues = this.updateMessageQueue.slice();
                this.updateMessageQueue = new Array();
                this.messageReadTick(queues, this.roomId);
            }
        });
    }
    static getInstance() {
        return ChatRoomComponent.instance;
    }
    static createInstance() {
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
    async save(room_id, messages) {
        let results = await this.dataManager.messageDAL.saveData(room_id, messages);
        return results;
    }
    async get(room_id) {
        let results = await this.dataManager.messageDAL.getData(room_id);
        return results;
    }
    saveToPersisted(message) {
        let self = this;
        this.get(this.roomId).then((chats) => {
            let chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array();
            if (message.type === MessageType[MessageType.Text]) {
                CryptoHelper.decryptionText(message)
                    .then(decoded => {
                    self.saveMessages(chatMessages, message);
                })
                    .catch(err => self.saveMessages(chatMessages, message));
            }
            else if (message.type === MessageType[MessageType.Sticker]) {
                let _message = getStickerPath(message);
                self.saveMessages(chatMessages, _message);
            }
            else {
                self.saveMessages(chatMessages, message);
            }
        }).catch(err => {
            console.warn("Cannot get persistend message of room", err);
        });
    }
    async decryptMessage(messages) {
        let self = this;
        let results = new Array();
        return new Promise((resolve, reject) => {
            if (messages.length > 0) {
                Rx.Observable.from(messages)
                    .mergeMap(async (message) => {
                    if (message.type === MessageType[MessageType.Text]) {
                        return await CryptoHelper.decryptionText(message);
                    }
                    else if (message.type === MessageType[MessageType.Sticker]) {
                        let _message = getStickerPath(message);
                        return await _message;
                    }
                    else {
                        return message;
                    }
                }).subscribe(value => {
                    results.push(value);
                }, (err) => {
                    console.warn("decryptMessage", err);
                    resolve(results);
                }, () => {
                    console.log("decryptMessage complete");
                    let sortResult = results.sort(self.compareMessage);
                    resolve(sortResult);
                });
            }
            else {
                resolve(messages);
            }
        });
    }
    onChat(message) {
        console.log("ChatRoomComponent.onChat", message);
        if (this.roomId === message.rid) {
            this.saveToPersisted(message);
        }
        else {
            console.log("this msg come from other room.");
            if (!!this.outsideRoomDelegete) {
                this.outsideRoomDelegete(ChatEvents.ON_CHAT, message);
            }
        }
    }
    onRoomJoin(data) { }
    onLeaveRoom(data) { }
    async messageReadTick(messageQueue, room_id) {
        let chatMessages = Object.create(null);
        let chats = await this.get(room_id);
        chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array();
        messageQueue.forEach(message => {
            chatMessages.some(value => {
                if (value._id === message._id) {
                    value.readers = message.readers;
                    return true;
                }
            });
        });
        let results = await this.save(room_id, chatMessages);
        if (!!this.chatroomDelegate) {
            this.chatroomDelegate(ON_MESSAGE_CHANGE, results);
        }
    }
    onMessageRead(message) {
        this.updateMessageQueue.push(message);
    }
    async getPersistentMessage(rid) {
        let self = this;
        let messages = await self.get(rid);
        if (messages && messages.length > 0) {
            return messages;
        }
        else {
            console.log("chatMessages is empty!");
            return new Array();
        }
    }
    async getNewerMessageRecord(sessionToken, callback) {
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
        const saveMergedMessage = async (decryptedChats) => {
            let _results = new Array();
            if (messages && messages.length > 0) {
                _results = messages.concat(decryptedChats);
            }
            else {
                _results = decryptedChats.slice();
            }
            // Save persistent chats log here.
            let results = await self.save(self.roomId, _results);
            callback(_results, this.roomId);
        };
        const getNewerMessage = async () => {
            let histories = await self.getNewerMessageFromNet(lastMessageTime, sessionToken);
            let decryptedChats = await self.decryptMessage(histories);
            saveMergedMessage(decryptedChats);
        };
        let messages = await self.get(this.roomId);
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
    }
    async getNewerMessageFromNet(lastMessageTime, sessionToken) {
        let self = this;
        let response = await chatroomService.getChatHistory(self.roomId, lastMessageTime, sessionToken);
        let value = await response.json();
        if (value.success) {
            let histories = new Array();
            histories = value.result;
            return histories;
        }
        else {
            console.log("WTF god only know.", value.message);
            throw new Error(value.message);
        }
    }
    async getOlderMessageChunk(room_id) {
        let self = this;
        async function saveRoomMessages(merged) {
            let value = await self.save(room_id, merged);
            return value;
        }
        let time = await self.getTopEdgeMessageTime();
        if (time) {
            let response = await chatroomService.getOlderMessagesCount(room_id, time.toString(), true);
            let result = await response.json();
            console.log("getOlderMessageChunk value", result);
            // todo
            /**
             * Merge messages record to chatMessages array.
             * Never save message to persistend layer.
             */
            if (result.success && result.result.length > 0) {
                let earlyMessages = result.result;
                let decryptedChats = await self.decryptMessage(earlyMessages);
                let persistMessages = await self.get(room_id);
                if (!!persistMessages && persistMessages.length > 0) {
                    let mergedMessageArray = new Array();
                    mergedMessageArray = decryptedChats.concat(persistMessages);
                    let resultsArray = new Array();
                    let results = await new Promise((resolve, rejected) => {
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
                    return await saveRoomMessages(results);
                }
                else {
                    let merged = decryptedChats.sort(self.compareMessage);
                    return await saveRoomMessages(merged);
                }
            }
            else {
                return new Array();
            }
        }
        else {
            throw new Error("getTopEdgeMessageTime fail");
        }
    }
    async getTopEdgeMessageTime() {
        let self = this;
        async function waitRoomMessage() {
            let topEdgeMessageTime = new Date();
            let messages = await self.get(self.roomId);
            if (!!messages && messages.length > 0) {
                if (!!messages[0].createTime) {
                    topEdgeMessageTime = messages[0].createTime;
                }
            }
            return topEdgeMessageTime;
        }
        return new Promise((resolve, reject) => {
            waitRoomMessage().then((topEdgeMessageTime) => {
                resolve(topEdgeMessageTime);
            }).catch(err => {
                reject(err);
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
    async updateWhoReadMyMessages() {
        let self = this;
        let res = await self.getTopEdgeMessageTime();
        let backendFactory = BackendFactory.getInstance();
        let chatroomApi = backendFactory.getServer().getChatRoomAPI();
        chatroomApi.getMessagesReaders(res.toString());
    }
    async getMessages() {
        let messages = await this.get(this.roomId);
        return messages;
    }
    dispose() {
        console.log("ChatRoomComponent: dispose");
        this.dataListener.removeOnChatListener(this.onChat.bind(this));
        ChatRoomComponent.instance = null;
    }
}
