/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * ChatRoomComponent for handle some business logic of chat room.
 */
import * as async from "async";

import { IRoomAccessListenerImp } from "./abstracts/IRoomAccessListenerImp";
import { Member } from "./models/Member";
import ChatLog from "./models/chatLog";
import DataManager from "./dataManager";
import DataListener from "./dataListener";
import BackendFactory from "./BackendFactory";
import * as CryptoHelper from "./utils/CryptoHelper";
import HttpCode from "../libs/stalk/utils/httpStatusCode";
import ServerImplement, { IDictionary } from "../libs/stalk/serverImplemented";
import * as DataModels from "./models/ChatDataModels";
import { MemberRole } from "./models/ChatDataModels";
import { MessageImp } from "./models/MessageImp";
import * as ServiceProvider from "./services/ServiceProvider";

import * as contactActions from "../redux/app/contactActions";
import Store from "../redux/configureStore";
import { Room } from "../../server/scripts/models/Room";

export interface ChatLogMap { [key: string]: ChatLog; };
export interface IUnread { message: DataModels.IMessage; rid: string; count: number; };
export class Unread { message: DataModels.IMessage; rid: string; count: number; };

export default class ChatsLogComponent implements IRoomAccessListenerImp {
    serverImp: ServerImplement = null;
    dataManager: DataManager = null;
    dataListener: DataListener = null;

    private chatlog_count: number = 0;
    public _isReady: boolean;
    public onReady: () => void;
    public getRoomsInfoCompleteEvent: () => void;
    private convertDateService;
    private chatslog: ChatLogMap = {};
    public getChatsLog(): ChatLogMap {
        return this.chatslog;
    }

    private unreadMessageMap: Map<string, IUnread> = new Map<string, IUnread>();
    public getUnreadMessageMap(): Map<string, IUnread> {
        return this.unreadMessageMap;
    }
    public addUnreadMessage(unread: IUnread) {
        this.unreadMessageMap.set(unread.rid, unread);
    }
    public getUnreadItem(room_id: string): IUnread {
        return this.unreadMessageMap.get(room_id);
    }

    constructor(_convertDateService?) {
        this._isReady = false;
        this.convertDateService = _convertDateService;
        this.dataManager = BackendFactory.getInstance().dataManager;
        this.dataListener = BackendFactory.getInstance().dataListener;

        this.dataListener.addRoomAccessListenerImp(this);
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

    onAccessRoom(dataEvent) {
        let self = this;
        let roomAccess: DataModels.RoomAccessData[] = dataEvent.roomAccess;

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

    public getUnreadMessages(token: string, roomAccess: DataModels.RoomAccessData[], callback: (err, logsData: Array<IUnread>) => void) {
        let self = this;
        let unreadLogs = new Array<IUnread>();
        async.map(roomAccess, function iterator(item, cb) {
            if (!!item.roomId && !!item.accessTime) {
                ServiceProvider.getUnreadMessage(item.roomId, item.accessTime.toString(), token)
                    .then(response => response.json())
                    .then(value => {
                        console.log("getUnreadMessage: ", value);
                        if (value.success) {
                            let unread: IUnread = JSON.parse(JSON.stringify(value.result));
                            unread.rid = item.roomId;
                            unreadLogs.push(unread);
                        }

                        cb(null, null);
                    });
            }
            else {
                cb(null, null);
            }
        }, function done(err) {
            console.log("getUnreadMessages from your roomAccess is done.");
            callback(null, unreadLogs);
        });
    }

    public getUnreadMessage(token: string, roomAccess: DataModels.RoomAccessData, callback: (err, res: IUnread) => void) {
        ServiceProvider.getUnreadMessage(roomAccess.roomId, roomAccess.accessTime.toString(), token)
            .then(response => response.json())
            .then(value => {
                console.log("getUnreadMessage", value);
                if (value.success) {
                    let unread: IUnread = JSON.parse(JSON.stringify(value.result));
                    unread.rid = roomAccess.roomId;
                    CryptoHelper.decryptionText(unread.message as MessageImp).then(decoded => {
                        callback(null, unread);
                    }).catch(err => {
                        callback(null, unread);
                    });
                }
                else {
                    callback(value.message, null);
                }
            }).catch(err => {
                callback(err, null);
            });
    }

    private decorateRoomInfoData(roomInfo: Room) {
        if (roomInfo.type === DataModels.RoomType.privateChat) {
            if (Array.isArray(roomInfo.members)) {
                let others = roomInfo.members.filter((value) => !this.dataManager.isMySelf(value._id)) as Array<Member>;
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
        let token = Store.getState().authReducer.token;
        ServiceProvider.getRoomInfo(room_id, token)
            .then(response => response.json())
            .then(function (json) {
                console.log("getRoomInfo result", json);
                if (json.success) {
                    let roomInfos: Array<Room> = JSON.parse(JSON.stringify(json.result));
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

    public getRoomsInfo() {
        let self = this;
        let results = new Array<Room>();

        // create a queue object with concurrency 2
        let q = async.queue(function (task, callback) {
            let value = task as IUnread;
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
        }, 2);

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

    public manageChatLog() {
        let self = this;

        return new Promise((resolve, rejected) => {
            // create a queue object with concurrency 2
            let q = async.queue(function (task, callback) {
                let unread = task as IUnread;
                self.dataManager.roomDAL.get(unread.rid).then(room => {
                    if (!room) callback();
                    self.organizeChatLogMap(unread, room, () => {
                        callback();
                    });
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

            let contacts = await contactActions.getContactProfile(unread.message.sender);
            let sender = (!!contacts && contacts.length > 0) ? contacts[0].username : "";
            if (unread.message.body != null) {
                let displayMsg = unread.message.body;
                switch (`${unread.message.type}`) {
                    case DataModels.ContentType[DataModels.ContentType.Text]:
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
                    case DataModels.ContentType[DataModels.ContentType.Sticker]:
                        displayMsg = sender + " sent a sticker.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Voice]:
                        displayMsg = sender + " sent a voice message.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Image]:
                        displayMsg = sender + " sent a image.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Video]:
                        displayMsg = sender + " sent a video.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.Location]:
                        displayMsg = sender + " sent a location.";
                        self.setLogProp(log, displayMsg, function (log) {
                            self.addChatLog(log, done);
                        });
                        break;
                    case DataModels.ContentType[DataModels.ContentType.File]:
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
        this.chatslog[chatLog.id] = chatLog;
        done();
    }

    public checkRoomInfo(unread: IUnread): Promise<any> {
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