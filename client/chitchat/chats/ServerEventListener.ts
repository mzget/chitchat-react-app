/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * Support by@ nattapon.r@live.com
 */

import { StalkEvents, ChatEvents, PushEvents, IPomelo } from "stalk-js";
export abstract class ServerListener implements StalkEvents.IServerListener, StalkEvents.BaseEvents {
    onUserLogin;
    onUserLogout;
    onAccessRoom;
    onAddRoomAccess;
    onUpdatedLastAccessTime;
}

export class ServerEventListener {
    public static ON_VIDEO_CALL: string = "onVideoCall";
    public static ON_VOICE_CALL: string = "onVoiceCall";
    public static ON_HANGUP_CALL: string = "onHangupCall";
    public static ON_THE_LINE_IS_BUSY: string = "onTheLineIsBusy";
    // <!-- AccessRoom Info -->
    public static ON_ACCESS_ROOMS: string = "onAccessRooms";
    public static ON_ADD_ROOM_ACCESS: string = "onAddRoomAccess";
    public static ON_UPDATED_LASTACCESSTIME: string = "onUpdatedLastAccessTime";

    socket: IPomelo;

    constructor(socket: IPomelo) {
        this.socket = socket;
    }

    /**
     * 
     * 
     * @private
     * @type {StalkEvents.IServerListener}
     * @memberof ServerEventListener
     */
    private serverListener: ServerListener;
    public addServerListener(obj: ServerListener): void {
        this.serverListener = obj;

        let self = this;

        // <!-- AccessRoom Info -->
        self.socket.on(ServerEventListener.ON_ACCESS_ROOMS, (data) => {
            console.log(ServerEventListener.ON_ACCESS_ROOMS, data);

            self.serverListener.onAccessRoom(data);
        });
        self.socket.on(ServerEventListener.ON_ADD_ROOM_ACCESS, (data) => {
            console.log(ServerEventListener.ON_ADD_ROOM_ACCESS, data);

            self.serverListener.onAddRoomAccess(data);
        });
        self.socket.on(ServerEventListener.ON_UPDATED_LASTACCESSTIME, (data) => {
            console.log(ServerEventListener.ON_UPDATED_LASTACCESSTIME, data);

            self.serverListener.onUpdatedLastAccessTime(data);
        });

        // <!-- User -->
        self.socket.on(StalkEvents.ON_USER_LOGIN, data => {
            console.log(StalkEvents.ON_USER_LOGIN);

            self.serverListener.onUserLogin(data);
        });
        self.socket.on(StalkEvents.ON_USER_LOGOUT, data => {
            console.log(StalkEvents.ON_USER_LOGOUT);

            self.serverListener.onUserLogout(data);
        });
    }

    /**
     * 
     * 
     * @private
     * @type {ChatEvents.IChatServerEvents}
     * @memberof ServerEventListener
     */
    private chatServerListener: ChatEvents.IChatServerEvents;
    public addChatListener(obj: ChatEvents.IChatServerEvents): void {
        this.chatServerListener = obj;

        let self = this;

        self.socket.on(ChatEvents.ON_CHAT, function (data) {
            console.log(ChatEvents.ON_CHAT, JSON.stringify(data));

            self.chatServerListener.onChat(data);
        });
        self.socket.on(ChatEvents.ON_ADD, (data) => {
            console.log(ChatEvents.ON_ADD, data);

            self.chatServerListener.onRoomJoin(data);
        });
        self.socket.on(ChatEvents.ON_LEAVE, (data) => {
            console.log(ChatEvents.ON_LEAVE, data);

            self.chatServerListener.onLeaveRoom(data);
        });

        self.socket.on(ChatEvents.ON_GET_MESSAGES_READERS, (data) => {
            console.log(ChatEvents.ON_GET_MESSAGES_READERS);

            self.chatServerListener.onGetMessagesReaders(data);
        });
    }

    /**
     * 
     * 
     * @private
     * @type {StalkEvents.IRTCListener}
     * @memberof ServerEventListener
     */
    private rtcCallListener: StalkEvents.IRTCListener;
    public addRTCListener(obj: StalkEvents.IRTCListener): void {
        this.rtcCallListener = obj;

        let self = this;

        self.socket.on(ServerEventListener.ON_VIDEO_CALL, (data) => {
            console.log(ServerEventListener.ON_VIDEO_CALL, JSON.stringify(data));

            self.rtcCallListener.onVideoCall(data);
        });
        self.socket.on(ServerEventListener.ON_VOICE_CALL, (data) => {
            console.log(ServerEventListener.ON_VOICE_CALL, JSON.stringify(data));

            self.rtcCallListener.onVoiceCall(data);
        });
        self.socket.on(ServerEventListener.ON_HANGUP_CALL, (data) => {
            console.log(ServerEventListener.ON_HANGUP_CALL, JSON.stringify(data));

            self.rtcCallListener.onHangupCall(data);
        });
        self.socket.on(ServerEventListener.ON_THE_LINE_IS_BUSY, (data) => {
            console.log(ServerEventListener.ON_THE_LINE_IS_BUSY, JSON.stringify(data));

            self.rtcCallListener.onTheLineIsBusy(data);
        });
    }

    /**
     * @private
     * @type {StalkEvents.IPushServerListener}
     * @memberof ServerEventListener
     */
    private pushServerListener: PushEvents.IPushServerListener;
    public addPushListener(obj: PushEvents.IPushServerListener) {
        this.pushServerListener = obj;

        let self = this;

        self.socket.on(PushEvents.ON_PUSH, function (data) {
            self.pushServerListener.onPush(data);
        });
    }
}