/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */

import * as async from "async";

import { BackendFactory } from "./BackendFactory";
import { DataManager } from "./DataManager";
import { DataListener } from "./DataListener";
import { Stalk, ChatEvents, ServerImplemented, ChatRoomApiProvider } from "stalk-js";
import * as CryptoHelper from "./utils/CryptoHelper";
import * as chatroomService from "./services/chatroomService";

import { ISecureService } from "./secure/ISecureService";
import SecureServiceFactory from "./secure/secureServiceFactory";

import { MessageType, IMessage } from "../shared/Message";
import { Room, IMember } from "../shared/Room";
import { RoomAccessData } from "../shared/Stalk";
import { MessageImp } from "./models/MessageImp";

import { imagesPath } from "../consts/StickerPath";
import { ChitChatFactory } from "./ChitchatFactory";
const getConfig = () => ChitChatFactory.getInstance().config;
const getStore = () => ChitChatFactory.getInstance().store;

import { ServerEventListener } from "./ServerEventListener";

export class ChatRoomComponent implements ChatEvents.IChatServerEvents {
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
    private dataListener: DataListener;

    constructor() {
        this.secure = SecureServiceFactory.getService();
        this.chatRoomApi = BackendFactory.getInstance().getChatApi();

        this.dataManager = BackendFactory.getInstance().dataManager;
        this.dataListener = BackendFactory.getInstance().dataListener;

        this.dataListener.addOnChatListener(this.onChat.bind(this));
    }

    onChat(message: MessageImp) {
        console.log("ChatRoomComponent.onChat");
        let self = this;

        const saveMessages = (chatMessages: Array<IMessage>) => {
            chatMessages.push(message);

            self.dataManager.messageDAL.saveData(self.roomId, chatMessages).then(chats => {
                if (!!this.chatroomDelegate) {
                    this.chatroomDelegate(ChatEvents.ON_CHAT, message);
                }
            });
        };

        if (this.roomId === message.rid) {
            this.dataManager.messageDAL.getData(this.roomId).then((chats: Array<any>) => {
                return chats;
            }).then((chats: IMessage[]) => {
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
                this.outsideRoomDelegete(ChatEvents.ON_CHAT, message);
            }
        }
    }

    onRoomJoin(data) { }

    onLeaveRoom(data) { }

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
        console.log("onGetMessagesReaders", dataEvent);

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

    public async getPersistentMessage(rid: string) {
        let self = this;
        let messages = await self.dataManager.messageDAL.getData(rid);

        if (messages && messages.length > 0) {
            let prom = new Promise((resolve: (data: Array<IMessage>) => void, reject) => {
                let chats = messages.slice(0) as Array<IMessage>;
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

            let chats = await prom;
            return chats;
        }
        else {
            console.log("chatMessages is empty!");
            return new Array<IMessage>();
        }
    }

    public async getNewerMessageRecord(sessionToken: string, callback: (results: Array<IMessage>) => void) {
        let self = this;
        let lastMessageTime = new Date();

        const getLastMessageTime = (cb: (boo: boolean) => void) => {
            let { roomAccess }: { roomAccess: Array<RoomAccessData> } = getStore().getState().chatlogReducer;
            async.some(roomAccess, (item, cb) => {
                if (item.roomId === self.roomId) {
                    lastMessageTime = item.accessTime;
                    cb(null, true);
                }
                else cb(null, false);
            }, (err, result) => {
                cb(result);
            });
        };

        const saveMergedMessage = async (histories: Array<IMessage>) => {
            let _results = new Array();
            if (messages && messages.length > 0) {
                _results = messages.concat(histories);
            }
            else {
                _results = histories.slice();
            }
            // Save persistent chats log here.
            let results = await self.dataManager.messageDAL.saveData(self.roomId, _results) as Array<IMessage>;

            callback(_results);
        };

        const getNewerMessage = async () => {
            let histories = await self.getNewerMessageFromNet(lastMessageTime, sessionToken) as Array<IMessage>;
            saveMergedMessage(histories);
        };

        let messages: IMessage[] = await self.dataManager.messageDAL.getData(this.roomId);
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
        } else {
            getLastMessageTime((boo) => {
                getNewerMessage();
            });
        }
    }

    private async getNewerMessageFromNet(lastMessageTime: Date, sessionToken: string) {
        let self = this;

        let response = await chatroomService.getChatHistory(self.roomId, lastMessageTime, sessionToken);
        let value = await response.json();

        return new Promise((resolve, reject) => {
            console.log("getChatHistory: ", value);
            if (value.success) {
                let histories = new Array<IMessage>();
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
    }

    public async getOlderMessageChunk() {
        let self = this;

        async function waitForRoomMessages() {
            let messages = await self.dataManager.messageDAL.getData(self.roomId) as IMessage[];

            return messages;
        }

        async function saveRoomMessages(merged: Array<IMessage>) {
            let value = await self.dataManager.messageDAL.saveData(self.roomId, merged);

            return value;
        }

        let time = await self.getTopEdgeMessageTime() as Date;
        if (time) {
            let response = await chatroomService.getOlderMessagesCount(self.roomId, time.toString(), true);
            let result = await response.json();

            console.log("getOlderMessageChunk value", result);
            // todo
            /**
             * Merge messages record to chatMessages array.
             * Never save message to persistend layer.
             */
            if (result.success && result.result.length > 0) {
                let earlyMessages = result.result as Array<IMessage>;
                let persistMessages = await waitForRoomMessages();

                if (!!persistMessages && persistMessages.length > 0) {
                    let mergedMessageArray = new Array<IMessage>();
                    mergedMessageArray = earlyMessages.concat(persistMessages);

                    let resultsArray = new Array<IMessage>();
                    let results = await new Promise((resolve: (data: Array<IMessage>) => void, rejected) => {
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
                    let merged = earlyMessages.sort(self.compareMessage);
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

    public async getTopEdgeMessageTime() {
        let self = this;

        async function waitRoomMessage() {
            let topEdgeMessageTime = new Date();
            let messages = await self.dataManager.messageDAL.getData(self.roomId) as IMessage[];

            if (!!messages && messages.length > 0) {
                if (!!messages[0].createTime) {
                    topEdgeMessageTime = messages[0].createTime;
                }
            }
            console.log("topEdgeMessageTime is: ", topEdgeMessageTime);

            return topEdgeMessageTime;
        }

        return new Promise((resolve: (data: Date) => void, reject) => {
            waitRoomMessage().then((topEdgeMessageTime) => {
                resolve(topEdgeMessageTime);
            }).catch(err => {
                reject(err);
            });
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
            // done.
        });
    }

    public async updateWhoReadMyMessages() {
        let self = this;

        let res = await self.getTopEdgeMessageTime();
        self.chatRoomApi.getMessagesReaders(res.toString());
    }

    public getMemberProfile(member: IMember, callback: (err, res) => void) {
        BackendFactory.getInstance().getServer().then(server => {
            if (server)
                server.gtMemberProfile(member._id, callback);
        });

    }

    public async getMessages() {
        let messages = await this.dataManager.messageDAL.getData(this.roomId);
        return messages;
    }

    public dispose() {
        this.dataListener.removeOnChatListener(this.onChat.bind(this));
        ChatRoomComponent.instance = null;
    }
}