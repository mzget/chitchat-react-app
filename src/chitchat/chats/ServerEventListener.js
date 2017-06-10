/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * Support by@ nattapon.r@live.com
 */
"use strict";
var stalk_js_1 = require("stalk-js");
var ServerListener = (function () {
    function ServerListener() {
    }
    return ServerListener;
}());
exports.ServerListener = ServerListener;
var ServerEventListener = (function () {
    function ServerEventListener(socket) {
        this.socket = socket;
    }
    ServerEventListener.prototype.addServerListener = function (obj) {
        this.serverListener = obj;
        var self = this;
        // <!-- AccessRoom Info -->
        self.socket.on(ServerEventListener.ON_ACCESS_ROOMS, function (data) {
            console.log(ServerEventListener.ON_ACCESS_ROOMS, data);
            self.serverListener.onAccessRoom(data);
        });
        self.socket.on(ServerEventListener.ON_ADD_ROOM_ACCESS, function (data) {
            console.log(ServerEventListener.ON_ADD_ROOM_ACCESS, data);
            self.serverListener.onAddRoomAccess(data);
        });
        self.socket.on(ServerEventListener.ON_UPDATED_LASTACCESSTIME, function (data) {
            console.log(ServerEventListener.ON_UPDATED_LASTACCESSTIME, data);
            self.serverListener.onUpdatedLastAccessTime(data);
        });
        // <!-- User -->
        self.socket.on(stalk_js_1.StalkEvents.ON_USER_LOGIN, function (data) {
            console.log(stalk_js_1.StalkEvents.ON_USER_LOGIN);
            self.serverListener.onUserLogin(data);
        });
        self.socket.on(stalk_js_1.StalkEvents.ON_USER_LOGOUT, function (data) {
            console.log(stalk_js_1.StalkEvents.ON_USER_LOGOUT);
            self.serverListener.onUserLogout(data);
        });
    };
    ServerEventListener.prototype.addChatListener = function (obj) {
        this.chatServerListener = obj;
        var self = this;
        self.socket.on(stalk_js_1.ChatEvents.ON_CHAT, function (data) {
            console.log(stalk_js_1.ChatEvents.ON_CHAT, JSON.stringify(data));
            self.chatServerListener.onChat(data);
        });
        self.socket.on(stalk_js_1.ChatEvents.ON_ADD, function (data) {
            console.log(stalk_js_1.ChatEvents.ON_ADD, data);
            self.chatServerListener.onRoomJoin(data);
        });
        self.socket.on(stalk_js_1.ChatEvents.ON_LEAVE, function (data) {
            console.log(stalk_js_1.ChatEvents.ON_LEAVE, data);
            self.chatServerListener.onLeaveRoom(data);
        });
        self.socket.on(stalk_js_1.ChatEvents.ON_MESSAGE_READ, function (data) {
            console.log(stalk_js_1.ChatEvents.ON_MESSAGE_READ, data);
            self.chatServerListener.onMessageRead(data);
        });
        self.socket.on(stalk_js_1.ChatEvents.ON_GET_MESSAGES_READERS, function (data) {
            console.log(stalk_js_1.ChatEvents.ON_GET_MESSAGES_READERS);
            self.chatServerListener.onGetMessagesReaders(data);
        });
    };
    ServerEventListener.prototype.addRTCListener = function (obj) {
        this.rtcCallListener = obj;
        var self = this;
        self.socket.on(ServerEventListener.ON_VIDEO_CALL, function (data) {
            console.log(ServerEventListener.ON_VIDEO_CALL, JSON.stringify(data));
            self.rtcCallListener.onVideoCall(data);
        });
        self.socket.on(ServerEventListener.ON_VOICE_CALL, function (data) {
            console.log(ServerEventListener.ON_VOICE_CALL, JSON.stringify(data));
            self.rtcCallListener.onVoiceCall(data);
        });
        self.socket.on(ServerEventListener.ON_HANGUP_CALL, function (data) {
            console.log(ServerEventListener.ON_HANGUP_CALL, JSON.stringify(data));
            self.rtcCallListener.onHangupCall(data);
        });
        self.socket.on(ServerEventListener.ON_THE_LINE_IS_BUSY, function (data) {
            console.log(ServerEventListener.ON_THE_LINE_IS_BUSY, JSON.stringify(data));
            self.rtcCallListener.onTheLineIsBusy(data);
        });
    };
    ServerEventListener.prototype.addPushListener = function (obj) {
        this.pushServerListener = obj;
        var self = this;
        self.socket.on(stalk_js_1.PushEvents.ON_PUSH, function (data) {
            console.log(stalk_js_1.PushEvents.ON_PUSH, JSON.stringify(data));
            self.pushServerListener.onPush(data);
        });
    };
    return ServerEventListener;
}());
ServerEventListener.ON_VIDEO_CALL = "onVideoCall";
ServerEventListener.ON_VOICE_CALL = "onVoiceCall";
ServerEventListener.ON_HANGUP_CALL = "onHangupCall";
ServerEventListener.ON_THE_LINE_IS_BUSY = "onTheLineIsBusy";
// <!-- AccessRoom Info -->
ServerEventListener.ON_ACCESS_ROOMS = "onAccessRooms";
ServerEventListener.ON_ADD_ROOM_ACCESS = "onAddRoomAccess";
ServerEventListener.ON_UPDATED_LASTACCESSTIME = "onUpdatedLastAccessTime";
exports.ServerEventListener = ServerEventListener;
