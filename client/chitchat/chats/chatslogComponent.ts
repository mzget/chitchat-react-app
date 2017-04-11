/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
import * as async from "async";

import { IRoomAccessListenerImp } from "./abstracts/IRoomAccessListenerImp";
import ChatLog from "./models/chatLog";
import DataManager from "./dataManager";
import DataListener from "./dataListener";
import { BackendFactory } from "./BackendFactory";
import * as CryptoHelper from "./utils/CryptoHelper";
import { ServerImplemented, IDictionary } from "../libs/stalk/serverImplemented";
import { IMessage, MessageType, IMessageMeta } from "../libs/shared/Message";
import { Room, RoomStatus, RoomType } from "../libs/shared/Room";
import { RoomAccessData, StalkAccount } from "../libs/shared/Stalk";
import { ContactInfo } from "./models/Contact";
import { MessageImp } from "./models/MessageImp";
import { MemberImp } from "./models/MemberImp";

import * as ServiceProvider from "./services/ServiceProvider";
import * as chatlogActionsHelper from "./redux/chatlogs/chatlogActionsHelper";


export type ChatLogMap = Map<string, ChatLog>;
export type UnreadMap = Map<string, IUnread>;
export interface IUnread { message: IMessage; rid: string; count: number; }
export class Unread { message: IMessage; rid: string; count: number; }

export class ChatsLogComponent implements IRoomAccessListenerImp {
    serverImp: ServerImplemented = null;
    dataManager: DataManager = null;
    dataListener: DataListener = null;

    private chatlog_count: number = 0;
    public _isReady: boolean;
    public onReady: (rooms: Array<Room>) => void;
    public getRoomsInfoCompleteEvent: () => void;
    private chatslog = new Map<string, ChatLog>();
    public getChatsLog(): Array<ChatLog> {
        return Array.from(this.chatslog.values());
    }

    private unreadMessageMap = new Map<string, IUnread>();
    public getUnreadMessageMap(): UnreadMap {
        return this.unreadMessageMap;
    }
    public setUnreadMessageMap(unreads: Array<IUnread>) {
        unreads.map(v => {
            this.unreadMessageMap.set(v.rid, v);
        });
    }
    public addUnreadMessage(unread: IUnread) {
        this.unreadMessageMap.set(unread.rid, unread);
    }
    public getUnreadItem(room_id: string): IUnread {
        return this.unreadMessageMap.get(room_id);
    }

    constructor() {
        this._isReady = false;
        this.dataManager = BackendFactory.getInstance().dataManager;
        this.dataListener = BackendFactory.getInstance().dataListener;

        this.dataListener.addOnRoomAccessListener(this.onAccessRoom.bind(this));
        this.dataListener.addOnChatListener(this.onChat.bind(this));
        this.dataListener.addOnAddRoomAccessListener(this.onAddRoomAccess.bind(this));
        this.dataListener.addOnUpdateRoomAccessListener(this.onUpdatedLastAccessTime.bind(this));

        BackendFactory.getInstance().getServer().then(server => {
            this.serverImp = server;
        }).catch(err => {
            console.log(err);
        });

        console.log("ChatsLogComponent : constructor");
    }

    private chatListeners = new Array<(param) => void>();
    public addOnChatListener(listener) {
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

    onAccessRoom(dataEvent: StalkAccount) {
        let self = this;

        this.unreadMessageMap.clear();
        this.chatslog.clear();

        let roomAccess = dataEvent.roomAccess as Array<RoomAccessData>;
        let results = new Array<Room>();

        const addRoomData = () => {
            async.map(roomAccess, function iterator(item, resultCallback) {
                self.getRoomInfo(item.roomId, (err, room) => {
                    if(!!room) {
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

    public updatedLastAccessTimeEvent: (data) => void;
    onUpdatedLastAccessTime(dataEvent) {
        if (!!this.updatedLastAccessTimeEvent) {
            this.updatedLastAccessTimeEvent(dataEvent);
        }
    }
    public addNewRoomAccessEvent: (data) => void;
    onAddRoomAccess(dataEvent) {
        console.warn("ChatsLogComponent.onAddRoomAccess", JSON.stringify(dataEvent));

        if (!!this.addNewRoomAccessEvent) {
            this.addNewRoomAccessEvent(dataEvent);
        }
    }

    public getUnreadMessages(user_id: string, roomAccess: RoomAccessData[], callback: (err, logsData: Array<IUnread>) => void) {
        let self = this;
        let unreadLogs = new Array<IUnread>();

        // create a queue object with concurrency 2
        let q = async.queue(function (task: RoomAccessData, callback: () => void) {
            if (!!task.roomId && !!task.accessTime) {
                self.getUnreadMessage(user_id, task).then(value => {
                    unreadLogs.push(value);

                    callback();
                }).catch(err => {
                    callback();
                });
            } else {
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

    public async getUnreadMessage(user_id: string, roomAccess: RoomAccessData) {
        let response = await ServiceProvider.getUnreadMessage(roomAccess.roomId, user_id, roomAccess.accessTime.toString());
        let value = await response.json();

        console.log("getUnreadMessage result: ", value);
        if (value.success) {
            let unread = value.result as IUnread;
            unread.rid = roomAccess.roomId;
            let decoded = await CryptoHelper.decryptionText(unread.message as MessageImp);

            return unread;
        }
        else {
            throw new Error(value.message);
        }
    }

    private decorateRoomInfoData(roomInfo: Room) {
        if (roomInfo.type == RoomType.privateChat) {
            if (Array.isArray(roomInfo.members)) {
                let others = roomInfo.members.filter((value) => !this.dataManager.isMySelf(value._id)) as Array<MemberImp>;
                if (others.length > 0) {
                    let contact = others[0];

                    roomInfo.name = (contact.username) ? contact.username : "EMPTY ROOM";
                    roomInfo.image = (contact.avatar) ? contact.avatar : null;
                }
            }
        }
        return roomInfo;
    }

    private getRoomInfo(room_id: string, callback: (err, room: Room) => void) {
        let self = this;

        ServiceProvider.getRoomInfo(room_id)
            .then(response => response.json())
            .then(function (json) {
                console.log("getRoomInfo value:", json);
                if (json.success) {
                    let roomInfos = json.result as Array<Room>;
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

    public getRoomsInfo(user_id: string, chatrooms: Array<Room>) {
        let self = this;

        // create a queue object with concurrency 2
        let q = async.queue(function (task, callback) {
            let value = task as IUnread;
            let rooms = chatrooms.filter(v => v._id == value.rid);
            let roomInfo = (rooms.length > 0) ? rooms[0] : null as Room;
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

    public manageChatLog(chatrooms: Array<Room>): Promise<ChatLogMap> {
        let self = this;

        return new Promise((resolve, rejected) => {
            // create a queue object with concurrency 2
            let q = async.queue(function (task, callback) {
                let unread = task as IUnread;
                let rooms = chatrooms.filter(v => v._id == unread.rid);
                let room = (rooms.length > 0) ? rooms[0] : null as Room;
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

    private async organizeChatLogMap(unread: IUnread, roomInfo: Room, done) {
        let self = this;
        let log = new ChatLog(roomInfo);
        log.setNotiCount(unread.count);

        if (!!unread.message) {
            log.setLastMessageTime(unread.message.createTime.toString());

            let contact = await chatlogActionsHelper.getContactProfile(unread.message.sender);
            let sender = (!!contact) ? contact.displayname : "";
            if (unread.message.body != null) {
                let displayMsg = unread.message.body;
                switch (`${unread.message.type}`) {
                    case MessageType[MessageType.Text]:
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
                    case MessageType[MessageType.Sticker]:
                        displayMsg = sender + " sent a sticker.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.Voice]:
                        displayMsg = sender + " sent a voice message.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.Image]:
                        displayMsg = sender + " sent a image.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.Video]:
                        displayMsg = sender + " sent a video.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.Location]:
                        displayMsg = sender + " sent a location.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case MessageType[MessageType.File]:
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

    private setLogProp(log: ChatLog, displayMessage, callback: (log: ChatLog) => void) {
        log.setLastMessage(displayMessage);

        callback(log);
    }
    private addChatLog(chatLog: ChatLog, done: () => void) {
        this.chatslog.set(chatLog.id, chatLog);
        done();
    }
    public checkRoomInfo(unread: IUnread, chatrooms: Array<Room>): Promise<Room> {
        let self = this;
        return new Promise((resolve, rejected) => {
            let rooms = (!!chatrooms && chatrooms.length > 0) ? chatrooms.filter(v => v._id == unread.rid) : [];
            let roomInfo = rooms[0] as Room;
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

    public getChatsLogCount(): number {
        return this.chatlog_count;
    }
    public increaseChatsLogCount(num: number) {
        this.chatlog_count += num;
    }
    public decreaseChatsLogCount(num: number) {
        this.chatlog_count -= num;
    }
    public calculateChatsLogCount() {
        this.chatlog_count = 0;
        this.unreadMessageMap.forEach((value, key) => {
            let count = value.count;
            this.chatlog_count += count;
        });
    }
}