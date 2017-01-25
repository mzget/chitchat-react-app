/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */

import * as async from "async";

import BackendFactory from "./BackendFactory";
import DataManager from "./dataManager";
import ServerImplemented from "../libs/stalk/serverImplemented";
import ChatRoomApiProvider from "../libs/stalk/chatRoomApiProvider";
import ServerEventListener from "../libs/stalk/serverEventListener";
import { absSpartan } from "../libs/stalk/spartanEvents";
import SecureServiceFactory from "../libs/chitchat/services/secureServiceFactory";
import { ContentType, IMember, IMessage } from "./models/ChatDataModels";
import { MessageImp } from "./models/MessageImp";
import { ISecureService } from "../libs/chitchat/services/ISecureService";
import * as CryptoHelper from './utils/CryptoHelper';

import config from "../configs/config";
import { imagesPath } from '../consts/StickerPath';

let serverImp: ServerImplemented = null;

export default class ChatRoomComponent implements absSpartan.IChatServerListener {
    private static instance: ChatRoomComponent;
    public static getInstance(): ChatRoomComponent {
        if (!ChatRoomComponent.instance) {
            ChatRoomComponent.instance = new ChatRoomComponent();
        }

        return ChatRoomComponent.instance;
    }

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
    private secure: ISecureService;
    private dataManager: DataManager;

    constructor() {
        this.secure = SecureServiceFactory.getService();
        this.chatRoomApi = BackendFactory.getInstance().getChatApi();
        BackendFactory.getInstance().getServer().then(server => {
            serverImp = server;
        }).catch(err => {

        });
        this.dataManager = BackendFactory.getInstance().dataManager;
    }

    onChat(message: MessageImp) {
        console.log("ChatRoomComponent.onChat");
        let self = this;

        const saveMessages = (chatMessages: Array<IMessage>) => {
            chatMessages.push(message);

            self.dataManager.messageDAL.saveData(self.roomId, chatMessages).then(chats => {
                if (!!this.chatroomDelegate)
                    this.chatroomDelegate(ServerEventListener.ON_CHAT, message);
            });
        }

        this.dataManager.messageDAL.getData(this.roomId).then((chats: Array<any>) => {
            return chats;
        }).then((chats: IMessage[]) => {
            let chatMessages = (!!chats && Array.isArray(chats)) ? chats : new Array();
            if (this.roomId === message.rid) {
                if (message.type == ContentType[ContentType.Text]) {
                    CryptoHelper.decryptionText(message).then(decoded => {
                        saveMessages(chatMessages);
                    }).catch(err => saveMessages(chatMessages));
                }
                else if (message.type == ContentType[ContentType.Sticker]) {
                    let sticker_id = parseInt(message.body);

                    message.src = imagesPath[sticker_id].img;
                    saveMessages(chatMessages);
                }
                else {
                    saveMessages(chatMessages);
                }
            }
            else {
                console.info("this msg come from other room.");

                if (!!this.outsideRoomDelegete) {
                    this.outsideRoomDelegete(ServerEventListener.ON_CHAT, message);
                }
            }
        }).catch(err => {
            console.error("Cannot get persistend message of room", err);
        });
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
            self.dataManager.messageDAL.saveData(self.roomId, self.chatMessages);
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

        self.dataManager.messageDAL.saveData(self.roomId, self.chatMessages);
    }

    public getPersistentMessage(rid: string): Promise<any> {
        let self = this;

        return new Promise((resolve, reject) => {
            self.dataManager.messageDAL.getData(rid).then(messages => {
                let chats = messages.slice(0) as Array<IMessage>;
                async.forEach(chats, function iterator(chat, result) {
                    if (chat.type === ContentType[ContentType.Text]) {
                        if (config.appConfig.encryption == true) {
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
            }).catch(err => {
                console.log("chatMessages is empty!");
                resolve(new Array<IMessage>());
            });
        });
    }

    public getNewerMessageRecord(callback: (err, res) => void) {
        let self = this;
        let lastMessageTime = new Date();

        const getLastMessageTime = (cb: (boo: boolean) => void) => {
            let roomAccess = self.dataManager.getRoomAccess();
            async.some(roomAccess, (item, cb) => {
                if (item.roomId === self.roomId) {
                    lastMessageTime = item.accessTime;
                    cb(null, true);
                }
                else cb(null, false);
            }, (err, result) => {
                cb(result);
            });
        }

        self.dataManager.messageDAL.getData(this.roomId).then((messages: IMessage[]) => {
            if (messages && messages.length > 0) {
                if (messages[messages.length - 1] != null) {
                    lastMessageTime = messages[messages.length - 1].createTime;
                    self.getNewerMessageFromNet(lastMessageTime, callback);
                }
                else {
                    getLastMessageTime((boo) => {
                        self.getNewerMessageFromNet(lastMessageTime, callback);
                    });
                }
            }
            else {
                getLastMessageTime((boo) => {
                    self.getNewerMessageFromNet(lastMessageTime, callback);
                });
            }
        }).catch(err => {
            console.error(err + ": Cannot get persistend message of room");
        });
    }

    private getNewerMessageFromNet(lastMessageTime: Date, callback: (err, res) => void) {
        let self = this;

        self.chatRoomApi.getChatHistory(self.roomId, lastMessageTime, function (err, result) {
            let histories = [];
            if (result.code === 200) {
                histories = result.data;
                console.info("Newer message counts.", histories.length);
                if (histories.length > 0) {

                    let messages: Array<IMessage> = JSON.parse(JSON.stringify(histories));

                    async.forEach(messages, function (chat, cb) {
                        if (chat.type == ContentType[ContentType.Text]) {
                            if (config.appConfig.encryption == true) {
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
                            console.error('get newer message error', err);
                        }

                        //<!-- Save persistent chats log here.
                        self.dataManager.messageDAL.saveData(self.roomId, messages);

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

        async function waitForRoomMessage() {
            let messages = await self.dataManager.messageDAL.getData(self.roomId) as IMessage[];

            return messages;
        }
        self.getTopEdgeMessageTime(function done(err, res) {
            self.chatRoomApi.getOlderMessageChunk(self.roomId, res, function response(err, res) {
                //@ todo.
                /**
                 * Merge messages record to chatMessages array.
                 * Never save message to persistend layer.
                 */
                if (res.code == 200) {
                    let datas = res.data as Array<IMessage>;
                    let earlyMessages: Array<IMessage> = datas;
                    if (earlyMessages.length > 0) {
                        waitForRoomMessage().then(messages => {
                            if (!!messages && messages.length > 0) {
                                let mergedArray: Array<IMessage> = [];
                                mergedArray = earlyMessages.concat(messages);

                                let resultsArray: Array<IMessage> = [];
                                async.map(mergedArray, function iterator(item, cb) {
                                    let hasMessage = resultsArray.some(function itor(value, id, arr) {
                                        if (!!value && value._id == item._id) {
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
                                }, function done(err, results) {
                                    let merged = resultsArray.sort(self.compareMessage);
                                    self.dataManager.messageDAL.saveData(self.roomId, merged).then(value => {
                                        callback(null, value);
                                    });
                                });
                            }
                            else {
                                let merged = earlyMessages.sort(self.compareMessage);
                                self.dataManager.messageDAL.saveData(self.roomId, merged).then(value => {
                                    callback(null, value);
                                });
                            }
                        }).catch(err => {
                            console.error(err + ": Cannot get room message/");
                        });
                    }
                    else {
                        callback(null, null);
                    }
                }
                else {
                    callback(res, null);
                }
            });
        });
    }

    public getTopEdgeMessageTime(callback: (err, res) => void) {
        let self = this;
        let topEdgeMessageTime: Date = new Date();

        async function waitRoomMessage() {
            let messages = await self.dataManager.messageDAL.getData(self.roomId) as IMessage[];

            if (!!messages && messages.length > 0) {
                if (!!messages[0].createTime) {
                    topEdgeMessageTime = messages[0].createTime;
                }
            }
            console.log('topEdgeMessageTime is: ', topEdgeMessageTime);
        }

        waitRoomMessage().then(() => {
            callback(null, topEdgeMessageTime);
        }).catch(err => {
            console.error(err + "\/Cannot get room message/");
        });
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

    public getMemberProfile(member: IMember, callback: (err, res) => void) {
        ServerImplemented.getInstance().getMemberProfile(member._id, callback);
    }

    public getMessages(): Promise<any> {
        return this.dataManager.messageDAL.getData(this.roomId);
    }

    public dispose() {
        ChatRoomComponent.instance = null;
    }
}