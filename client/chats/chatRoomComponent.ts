﻿/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */

import * as async from "async";

import BackendFactory from "./BackendFactory";
import ServerImplemented from "../libs/stalk/serverImplemented";
import ChatRoomApiProvider from "../libs/stalk/chatRoomApiProvider";
import ServerEventListener from "../libs/stalk/serverEventListener";
import { absSpartan } from "../libs/stalk/spartanEvents";
import { IMessageDAL } from "../libs/chitchat/dataAccessLayer/IMessageDAL";
import MessageDALFactory from "../libs/chitchat/dataAccessLayer/messageDALFactory";
import SecureServiceFactory from "../libs/chitchat/services/secureServiceFactory";
import { ContentType, Member, IMessage } from "./models/ChatDataModels";
import { ISecureService } from "../libs/chitchat/services/ISecureService";

import config from "../configs/config";
let serverImp: ServerImplemented = null;

export default class ChatRoomComponent implements absSpartan.IChatServerListener {
    private static instance: ChatRoomComponent;
    public static getInstance(): ChatRoomComponent {
        if (!ChatRoomComponent.instance) {
            ChatRoomComponent.instance = new ChatRoomComponent();
        }

        return ChatRoomComponent.instance;
    }

    public chatMessages: Array<IMessage> = [];
    public chatroomDelegate: (eventName: string, data: any) => void;
    public outsideRoomDelegete: (eventName: string, data: any) => void;
    private chatRoomApi: ChatRoomApiProvider;
    private roomId: string;
    public getRoomId(): string {
        return this.roomId;
    }
    public setRoomId(rid: string): void {
        this.roomId = rid;
    }
    private messageDAL: IMessageDAL;
    private secure: ISecureService;

    constructor() {
        this.secure = SecureServiceFactory.getService();
        this.messageDAL = MessageDALFactory.getObject();
        this.chatRoomApi = BackendFactory.getInstance().getChatApi();
        BackendFactory.getInstance().getServer().then(server => {
            serverImp = server;
        }).catch(err => {

        });
    }

    onChat(chatMessage: IMessage) {
        let self = this;

        if (this.roomId === chatMessage.rid) {
            if (chatMessage.type.toString() === ContentType[ContentType.Text]) {
                if (config.appConfig.encryption == true) {
                    self.secure.decryptWithSecureRandom(chatMessage.body, (err, res) => {
                        if (!err) {
                            chatMessage.body = res;
                            self.chatMessages.push(chatMessage);
                            self.messageDAL.saveData(self.roomId, self.chatMessages);

                            if (!!this.chatroomDelegate)
                                this.chatroomDelegate(ServerEventListener.ON_CHAT, chatMessage);
                        }
                        else {
                            console.log(err, res);
                            self.chatMessages.push(chatMessage);
                            self.messageDAL.saveData(self.roomId, self.chatMessages);

                            if (!!this.chatroomDelegate)
                                this.chatroomDelegate(ServerEventListener.ON_CHAT, chatMessage);
                        }
                    })
                }
                else {
                    self.chatMessages.push(chatMessage);
                    self.messageDAL.saveData(self.roomId, self.chatMessages);

                    if (!!this.chatroomDelegate)
                        this.chatroomDelegate(ServerEventListener.ON_CHAT, chatMessage);
                }
            }
            else {
                self.chatMessages.push(chatMessage);
                self.messageDAL.saveData(self.roomId, self.chatMessages);

                if (!!this.chatroomDelegate)
                    this.chatroomDelegate(ServerEventListener.ON_CHAT, chatMessage);
            }
        }
        else {
            console.warn("this msg come from other room.");

            if (!!this.outsideRoomDelegete) {
                this.outsideRoomDelegete(ServerEventListener.ON_CHAT, chatMessage);
            }
        }
    }

    onLeaveRoom(data) {

    }

    onRoomJoin(data) {

    }

    onMessageRead(dataEvent) {
        console.log("onMessageRead", JSON.stringify(dataEvent));

        let self = this;
        let newMsg: IMessage = JSON.parse(JSON.stringify(dataEvent));

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
            self.messageDAL.saveData(self.roomId, self.chatMessages);
        });
    }

    onGetMessagesReaders(dataEvent) {
        console.log('onGetMessagesReaders', dataEvent);

        let self = this;
        interface Ireaders {
            _id: string;
            readers: Array<string>;
        }
        let myMessagesArr: Array<Ireaders> = JSON.parse(JSON.stringify(dataEvent.data));

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

        self.messageDAL.saveData(self.roomId, self.chatMessages);
    }

    public getPersistentMessage(rid: string): Promise<any> {
        let self = this;

        return new Promise((resolve, reject) => {
            self.messageDAL.getData(rid, (err, messages) => {
                if (messages !== null) {
                    let chats: IMessage[] = messages.slice(0);
                    async.mapSeries(chats, function iterator(item, result) {
                        if (item.type === ContentType.Text) {
                            if (config.appConfig.encryption == true) {
                                self.secure.decryptWithSecureRandom(item.body, function (err, res) {
                                    if (!err) {
                                        item.body = res;
                                        self.chatMessages.push(item);
                                    }
                                    else {
                                        self.chatMessages.push(item);
                                    }

                                    result(null, item);
                                });
                            }
                            else {
                                self.chatMessages.push(item);
                                result(null, item);
                            }
                        }
                        else {
                            self.chatMessages.push(item);
                            result(null, item);
                        }
                    }, (err, results) => {
                        console.log("decode chats text completed.", self.chatMessages.length);

                        resolve(messages);
                    });
                }
                else {
                    self.chatMessages = [];

                    console.log("chatMessages", self.chatMessages.length);
                    resolve(self.chatMessages);
                }
            });
        });
    }

    public getNewerMessageRecord(callback: (err, res) => void) {
        let self = this;
        let lastMessageTime = new Date();
        let promise = new Promise(function promise(resolve, reject) {
            if (self.chatMessages[self.chatMessages.length - 1] != null) {
                lastMessageTime = self.chatMessages[self.chatMessages.length - 1].createTime;
                resolve();
            }
            else {
                let roomAccess = BackendFactory.getInstance().dataManager.getRoomAccess();
                async.some(roomAccess, (item, cb) => {
                    if (item.roomId === self.roomId) {
                        lastMessageTime = item.accessTime;
                        cb(true);
                    }
                    else cb(false);
                }, (result) => {
                    console.log(result);

                    if (result) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            }
        });

        promise.then((value) => {
            self.getNewerMessageFromNet(lastMessageTime, callback);
        });
        promise.catch(() => {
            console.warn("this room_id is not contain in roomAccess list.");

            self.getNewerMessageFromNet(lastMessageTime, callback);
        });
    }

    private getNewerMessageFromNet(lastMessageTime: Date, callback: (err, res) => void) {
        var self = this;

        self.chatRoomApi.getChatHistory(self.roomId, lastMessageTime, function (err, result) {
            var histories = [];
            if (result.code === 200) {
                histories = result.data;
                console.log("Newer message counts.", histories.length);
                if (histories.length > 0) {

                    var messages: Array<IMessage> = JSON.parse(JSON.stringify(histories));

                    async.mapSeries(messages, function (item, cb) {
                        if (item.type.toString() === ContentType[ContentType.Text]) {
                            if (config.appConfig.encryption == true) {
                                self.secure.decryptWithSecureRandom(item.body, function (err, res) {
                                    if (!err) {
                                        item.body = res;
                                        self.chatMessages.push(item);
                                    }
                                    else {
                                        self.chatMessages.push(item);
                                    }

                                    cb(null, item);
                                });
                            }
                            else {
                                self.chatMessages.push(item);
                                cb(null, item);
                            }
                        }
                        else {
                            self.chatMessages.push(item);
                            cb(null, item);
                        }
                    }, function done(err) {
                        if (!err) {
                            console.log("get newer message completed.");
                        }
                        else {
                            console.error('get newer message error', err);
                        }

                        console.log("chatMessage.Count", self.chatMessages.length);
                        //<!-- Save persistent chats log here.
                        self.messageDAL.saveData(self.roomId, self.chatMessages, (err, result) => {
                            //self.getNewerMessageRecord();
                        });

                        if (callback !== null) {
                            callback(null, result.code);
                        }
                    });
                }
                else {
                    console.log("Have no newer message.");


                    if (callback !== null) {
                        callback(null, result.code);
                    }
                }
            }
            else {
                console.warn("WTF god only know.", result.message);

                if (callback !== null) {
                    callback(null, result.code);
                }
            }
        });
    }

    public getOlderMessageChunk(callback: (err, res) => void) {
        let self = this;
        self.getTopEdgeMessageTime(function done(err, res) {
            self.chatRoomApi.getOlderMessageChunk(self.roomId, res, function response(err, res) {
                //@ todo.
                /**
                 * Merge messages record to chatMessages array.
                 * Never save message to persistend layer.
                 */
                let datas = [];
                datas = res.data;
                let clientMessages = self.chatMessages.slice(0);
                let mergedArray: Array<IMessage> = [];
                if (datas.length > 0) {
                    let messages: Array<IMessage> = JSON.parse(JSON.stringify(datas));
                    mergedArray = messages.concat(clientMessages);
                }

                let resultsArray: Array<IMessage> = [];
                async.map(mergedArray, function iterator(item, cb) {
                    let hasMessage = resultsArray.some(function itor(value, id, arr) {
                        if (value._id == item._id) {
                            return true;
                        }
                    });

                    if (hasMessage == false) {
                        resultsArray.push(item);
                        cb(null, null);
                    }
                    else {
                        cb(null, null);
                    }
                }, function done(err, results: Array<IMessage>) {
                    resultsArray.sort(self.compareMessage);

                    self.chatMessages = resultsArray.slice(0);

                    callback(err, resultsArray);

                    self.messageDAL.saveData(self.roomId, self.chatMessages);
                });
            });
        });
    }

    public checkOlderMessages(callback: (err, res) => void) {
        let self = this;
        self.getTopEdgeMessageTime(function done(err, res) {
            self.chatRoomApi.checkOlderMessagesCount(self.roomId, res, function response(err, res) {
                callback(err, res);
            });
        });
    }

    private getTopEdgeMessageTime(callback: (err, res) => void) {
        let self = this;
        let topEdgeMessageTime: Date = null;
        if (self.chatMessages != null && self.chatMessages.length != 0) {
            if (!!self.chatMessages[0].createTime) {
                topEdgeMessageTime = self.chatMessages[0].createTime;
            }
            else {
                topEdgeMessageTime = new Date();
            }
        }
        else {
            topEdgeMessageTime = new Date();
        }

        console.log('topEdgeMsg:', topEdgeMessageTime, JSON.stringify(self.chatMessages[0]));
        callback(null, topEdgeMessageTime);
    }

    private compareMessage(a: IMessage, b: IMessage) {
        if (a.createTime > b.createTime) {
            return 1;
        }
        if (a.createTime < b.createTime) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }

    public getMessage(chatId, Chats, callback: (joinRoomRes: any) => void) {
        let self = this;
        let myProfile = BackendFactory.getInstance().dataManager.getMyProfile();
        let chatLog = localStorage.getItem(myProfile._id + '_' + chatId);

        let promise = new Promise(function (resolve, reject) {
            if (!!chatLog) {
                console.log("Local chat history has a data...");

                if (JSON.stringify(chatLog) === "") {
                    self.chatMessages = [];
                    resolve();
                }
                else {
                    var arr_fromLog: Array<IMessage> = JSON.parse(chatLog);
                    if (arr_fromLog === null || arr_fromLog instanceof Array === false) {
                        self.chatMessages = [];
                        resolve();
                    }
                    else {
                        console.log("Decode local chat history for displaying:", arr_fromLog.length);
                        // let count = 0;
                        arr_fromLog.map((log, i, a) => {
                            var messageImp: any = log;
                            if (messageImp.type === ContentType[ContentType.Text]) {
                                if (config.appConfig.encryption == true) {
                                    self.secure.decryptWithSecureRandom(messageImp.body, function (err, res) {
                                        if (!err) {
                                            messageImp.body = res;
                                            self.chatMessages.push(messageImp);
                                        }
                                        else {
                                            //console.log(err, res);
                                            self.chatMessages.push(messageImp);
                                        }
                                    });
                                }
                                else {
                                    self.chatMessages.push(messageImp);
                                }
                            }
                            else {
                                // console.log("item:", count++, log.type);
                                self.chatMessages.push(log);
                            }
                        });
                        resolve();
                    }
                }
            }
            else {
                console.log("Have no local chat history.");
                self.chatMessages = [];
                resolve();
            }
        });

        promise.then(function onFulfilled() {
            console.log("get local history done:");
            serverImp.JoinChatRoomRequest(chatId, function (err, joinRoomRes) {
                if (joinRoomRes.code == 200) {
                    var access = new Date();
                    var roomAccess = self.dataManager.myProfile.roomAccess;
                    async.eachSeries(roomAccess, function iterator(item, cb) {
                        if (item.roomId == chatId) {
                            access = item.accessTime;
                        }

                        cb();
                    }, function done() {
                        self.chatRoomApi.getChatHistory(chatId, access, function (err, result) {
                            var histories = [];
                            if (result.code === 200) {
                                histories = result.data;
                            } else {
                                //console.warn("WTF god only know.", result.message);
                            }

                            var his_length = histories.length;
                            //console.log("new chat log", histories.length);
                            if (his_length > 0) {
                                async.eachSeries(histories, function (item, cb) {
                                    var chatMessageImp = JSON.parse(JSON.stringify(item));
                                    if (chatMessageImp.type === ContentType[ContentType.Text]) {
                                        if (ServerImplemented.getInstance().appConfig.encryption == true) {
                                            self.secure.decryptWithSecureRandom(chatMessageImp.body, function (err, res) {
                                                if (!err) {
                                                    chatMessageImp.body = res;
                                                    self.chatMessages.push(chatMessageImp);
                                                    cb();
                                                }
                                                else {
                                                    //console.warn(err, res);
                                                    cb();
                                                }
                                            });
                                        }
                                        else {
                                            self.chatMessages.push(chatMessageImp);
                                            cb();
                                        }
                                    }
                                    else {
                                        if (item.type == 'File') {
                                            console.log('file');
                                        }
                                        self.chatMessages.push(item);
                                        cb();
                                    }
                                }, function (err) {
                                    Chats.set(self.chatMessages);

                                    localStorage.removeItem(myProfile._id + '_' + chatId);
                                    localStorage.setItem(myProfile._id + '_' + chatId, JSON.stringify(self.chatMessages));

                                    callback(joinRoomRes);
                                });
                            }
                            else {
                                Chats.set(self.chatMessages);
                                callback(joinRoomRes);
                            }
                        });
                    });
                }
                else {
                    callback(joinRoomRes);
                }
            });

        }).catch(function onRejected(reason) {
            console.warn("promiss.onRejected", reason);
        });
    }

    public updateReadMessages() {
        let self = this;

        async.map(self.chatMessages, function itorator(message, resultCb) {
            if (!BackendFactory.getInstance().dataManager.isMySelf(message.sender)) {
                self.chatRoomApi.updateMessageReader(message._id, message.rid);
            }

            resultCb(null, null);
        }, function done(err) {
            //@ done.
        })
    }

    public updateWhoReadMyMessages() {
        let self = this;

        self.getTopEdgeMessageTime((err, res) => {
            self.chatRoomApi.getMessagesReaders(res);
        });
    }

    public getMemberProfile(member: Member, callback: (err, res) => void) {
        ServerImplemented.getInstance().getMemberProfile(member.id, callback);
    }

    public dispose() {
        ChatRoomComponent.instance = null;
    }
}