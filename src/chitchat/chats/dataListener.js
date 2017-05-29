"use strict";
var DataListener = (function () {
    function DataListener(dataManager) {
        var _this = this;
        this.onChatEventListeners = new Array();
        this.onLeaveRoomListeners = new Array();
        this.onRoomAccessEventListeners = new Array();
        this.addOnRoomAccessListener = function (listener) {
            _this.onRoomAccessEventListeners.push(listener);
        };
        this.removeOnRoomAccessListener = function (listener) {
            var id = _this.onRoomAccessEventListeners.indexOf(listener);
            _this.onRoomAccessEventListeners.splice(id, 1);
        };
        this.onUpdateRoomAccessEventListeners = new Array();
        this.addOnUpdateRoomAccessListener = function (listener) {
            _this.onUpdateRoomAccessEventListeners.push(listener);
        };
        this.removeOnUpdateRoomAccessListener = function (listener) {
            var id = _this.onUpdateRoomAccessEventListeners.indexOf(listener);
            _this.onUpdateRoomAccessEventListeners.splice(id, 1);
        };
        this.onAddRoomAccessEventListeners = new Array();
        this.addOnAddRoomAccessListener = function (listener) {
            _this.onAddRoomAccessEventListeners.push(listener);
        };
        this.removeOnAddRoomAccessListener = function (listener) {
            var id = _this.onAddRoomAccessEventListeners.indexOf(listener);
            _this.onAddRoomAccessEventListeners.splice(id, 1);
        };
        this.dataManager = dataManager;
    }
    DataListener.prototype.addOnChatListener = function (listener) {
        this.onChatEventListeners.push(listener);
    };
    DataListener.prototype.removeOnChatListener = function (listener) {
        var id = this.onChatEventListeners.indexOf(listener);
        this.onChatEventListeners.splice(id, 1);
    };
    DataListener.prototype.addOnLeaveRoomListener = function (listener) {
        this.onLeaveRoomListeners.push(listener);
    };
    DataListener.prototype.removeOnLeaveRoomListener = function (listener) {
        var id = this.onLeaveRoomListeners.indexOf(listener);
        this.onLeaveRoomListeners.splice(id, 1);
    };
    DataListener.prototype.onAccessRoom = function (dataEvent) {
        if (Array.isArray(dataEvent) && dataEvent.length > 0) {
            var data_1 = dataEvent[0];
            this.dataManager.setRoomAccessForUser(data_1);
            this.onRoomAccessEventListeners.map(function (listener) {
                listener(data_1);
            });
        }
    };
    DataListener.prototype.onUpdatedLastAccessTime = function (dataEvent) {
        this.dataManager.updateRoomAccessForUser(dataEvent);
        this.onUpdateRoomAccessEventListeners.map(function (item) { return item(dataEvent); });
    };
    DataListener.prototype.onAddRoomAccess = function (dataEvent) {
        var datas = JSON.parse(JSON.stringify(dataEvent));
        if (!!datas[0].roomAccess && datas[0].roomAccess.length !== 0) {
            this.dataManager.setRoomAccessForUser(dataEvent);
        }
        this.onAddRoomAccessEventListeners.map(function (value) { return value(dataEvent); });
    };
    DataListener.prototype.onCreateGroupSuccess = function (dataEvent) {
        var group = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.addGroup(group);
    };
    DataListener.prototype.onEditedGroupMember = function (dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupMembers(jsonObj);
        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(function (value) {
                value.onEditedGroupMember(dataEvent);
            });
        }
    };
    DataListener.prototype.onEditedGroupName = function (dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupName(jsonObj);
    };
    DataListener.prototype.onEditedGroupImage = function (dataEvent) {
        var obj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupImage(obj);
    };
    DataListener.prototype.onNewGroupCreated = function (dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.addGroup(jsonObj);
    };
    DataListener.prototype.onUpdateMemberInfoInProjectBase = function (dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupMemberDetail(jsonObj);
        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(function (value) {
                value.onUpdateMemberInfoInProjectBase(dataEvent);
            });
        }
    };
    //#region User.
    DataListener.prototype.onUserLogin = function (dataEvent) {
        console.log("user loged In", JSON.stringify(dataEvent));
        this.dataManager.onUserLogin(dataEvent);
    };
    DataListener.prototype.onUserLogout = function (dataEvent) {
        console.log("user loged Out", JSON.stringify(dataEvent));
    };
    DataListener.prototype.onUserUpdateImageProfile = function (dataEvent) {
        var jsonObj = JSON.parse(JSON.stringify(dataEvent));
        var _id = jsonObj._id;
        var path = jsonObj.path;
        this.dataManager.updateContactImage(_id, path);
    };
    DataListener.prototype.onUserUpdateProfile = function (dataEvent) {
        var jsonobj = JSON.parse(JSON.stringify(dataEvent));
        var params = jsonobj.params;
        var _id = jsonobj._id;
        this.dataManager.updateContactProfile(_id, params);
    };
    //#endregion
    /*******************************************************************************/
    // <!-- chat room data listener.
    DataListener.prototype.onChat = function (data) {
        var chatMessageImp = JSON.parse(JSON.stringify(data));
        this.onChatEventListeners.map(function (value, id, arr) {
            value(chatMessageImp);
        });
    };
    ;
    DataListener.prototype.onLeaveRoom = function (data) {
        this.onLeaveRoomListeners.map(function (value) { return value(data); });
    };
    ;
    DataListener.prototype.onRoomJoin = function (data) {
    };
    ;
    DataListener.prototype.onMessageRead = function (dataEvent) {
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach(function (value) {
                value.onMessageRead(dataEvent);
            });
        }
    };
    ;
    DataListener.prototype.onGetMessagesReaders = function (dataEvent) {
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach(function (value) {
                value.onGetMessagesReaders(dataEvent);
            });
        }
    };
    ;
    return DataListener;
}());
exports.DataListener = DataListener;
