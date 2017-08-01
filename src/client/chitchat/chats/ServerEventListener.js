import { StalkEvents, ChatEvents, PushEvents, CallingEvents } from "stalk-js";
export class ServerListener {
}
export class ServerEventListener {
    constructor(socket) {
        this.socket = socket;
    }
    addServerListener(obj) {
        this.serverListener = obj;
        let self = this;
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
        self.socket.on(StalkEvents.ON_USER_LOGIN, data => {
            console.log(StalkEvents.ON_USER_LOGIN);
            self.serverListener.onUserLogin(data);
        });
        self.socket.on(StalkEvents.ON_USER_LOGOUT, data => {
            console.log(StalkEvents.ON_USER_LOGOUT);
            self.serverListener.onUserLogout(data);
        });
    }
    addChatListener(obj) {
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
    }
    addCallingListener(obj) {
        this.callingListener = obj;
        let self = this;
        self.socket.on(CallingEvents.ON_CALL, (data) => {
            self.callingListener.onCall(data);
        });
    }
    addPushListener(obj) {
        this.pushServerListener = obj;
        let self = this;
        self.socket.on(PushEvents.ON_PUSH, function (data) {
            self.pushServerListener.onPush(data);
        });
    }
}
ServerEventListener.ON_ACCESS_ROOMS = "onAccessRooms";
ServerEventListener.ON_ADD_ROOM_ACCESS = "onAddRoomAccess";
ServerEventListener.ON_UPDATED_LASTACCESSTIME = "onUpdatedLastAccessTime";
