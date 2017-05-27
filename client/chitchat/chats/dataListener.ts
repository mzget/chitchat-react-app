import { absSpartan } from "../libs/stalk/spartanEvents";
import { StalkAccount, RoomAccessData } from "../shared/Stalk";
import { IMessage } from "../shared/Message";
import { Room } from "../shared/Room";

import DataManager from "./dataManager";

export default class DataListener implements absSpartan.IServerListener, absSpartan.IChatServerListener {
    private dataManager: DataManager;

    private onChatEventListeners = new Array<(message: IMessage) => void>();
    public addOnChatListener(listener: (message: IMessage) => void) {
        this.onChatEventListeners.push(listener);
    }
    public removeOnChatListener(listener: (message: IMessage) => void) {
        let id = this.onChatEventListeners.indexOf(listener);
        this.onChatEventListeners.splice(id, 1);
    }

    private onLeaveRoomListeners = new Array();
    public addOnLeaveRoomListener(listener: (message: IMessage) => void) {
        this.onLeaveRoomListeners.push(listener);
    }
    public removeOnLeaveRoomListener(listener: (message: IMessage) => void) {
        let id = this.onLeaveRoomListeners.indexOf(listener);
        this.onLeaveRoomListeners.splice(id, 1);
    }
    private onRoomAccessEventListeners = new Array<(data: StalkAccount) => void>();
    public addOnRoomAccessListener = (listener: (data: StalkAccount) => void) => {
        this.onRoomAccessEventListeners.push(listener);
    }
    public removeOnRoomAccessListener = (listener: (data) => void) => {
        let id = this.onRoomAccessEventListeners.indexOf(listener);
        this.onRoomAccessEventListeners.splice(id, 1);
    }


    private onUpdateRoomAccessEventListeners = new Array<(data: RoomAccessData) => void>();
    public addOnUpdateRoomAccessListener = (listener: (data: RoomAccessData) => void) => {
        this.onUpdateRoomAccessEventListeners.push(listener);
    }
    public removeOnUpdateRoomAccessListener = (listener: (data: RoomAccessData) => void) => {
        let id = this.onUpdateRoomAccessEventListeners.indexOf(listener);
        this.onUpdateRoomAccessEventListeners.splice(id, 1);
    }
    private onAddRoomAccessEventListeners = new Array();
    public addOnAddRoomAccessListener = (listener: (data) => void) => {
        this.onAddRoomAccessEventListeners.push(listener);
    }
    public removeOnAddRoomAccessListener = (listener: (data) => void) => {
        let id = this.onAddRoomAccessEventListeners.indexOf(listener);
        this.onAddRoomAccessEventListeners.splice(id, 1);
    }

    constructor(dataManager: DataManager) {
        this.dataManager = dataManager;
    }

    onAccessRoom(dataEvent: Array<any>) {
        if (Array.isArray(dataEvent) && dataEvent.length > 0) {
            let data = dataEvent[0] as StalkAccount;

            this.dataManager.setRoomAccessForUser(data);

            this.onRoomAccessEventListeners.map(listener => {
                listener(data);
            });
        }
    }

    onUpdatedLastAccessTime(dataEvent: RoomAccessData) {
        this.dataManager.updateRoomAccessForUser(dataEvent);

        this.onUpdateRoomAccessEventListeners.map(item => item(dataEvent));
    }

    onAddRoomAccess(dataEvent) {
        let datas: Array<StalkAccount> = JSON.parse(JSON.stringify(dataEvent));
        if (!!datas[0].roomAccess && datas[0].roomAccess.length !== 0) {
            this.dataManager.setRoomAccessForUser(dataEvent);
        }

        this.onAddRoomAccessEventListeners.map(value => value(dataEvent));
    }

    onCreateGroupSuccess(dataEvent) {
        let group: Room = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.addGroup(group);
    }

    onEditedGroupMember(dataEvent) {
        let jsonObj: Room = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupMembers(jsonObj);

        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onEditedGroupMember(dataEvent);
            });
        }
    }

    onEditedGroupName(dataEvent) {
        let jsonObj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupName(jsonObj);
    }

    onEditedGroupImage(dataEvent) {
        let obj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupImage(obj);
    }

    onNewGroupCreated(dataEvent) {
        let jsonObj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.addGroup(jsonObj);
    }

    onUpdateMemberInfoInProjectBase(dataEvent) {
        let jsonObj = JSON.parse(JSON.stringify(dataEvent));
        this.dataManager.updateGroupMemberDetail(jsonObj);
        if (!!this.roomAccessListenerImps) {
            this.roomAccessListenerImps.map(value => {
                value.onUpdateMemberInfoInProjectBase(dataEvent);
            });
        }
    }


    //#region User.

    onUserLogin(dataEvent) {
        this.dataManager.onUserLogin(dataEvent);
    }

    onUserUpdateImageProfile(dataEvent) {
        let jsonObj = JSON.parse(JSON.stringify(dataEvent));
        let _id = jsonObj._id;
        let path = jsonObj.path;

        this.dataManager.updateContactImage(_id, path);
    }

    onUserUpdateProfile(dataEvent) {
        let jsonobj = JSON.parse(JSON.stringify(dataEvent));
        let params = jsonobj.params;
        let _id = jsonobj._id;

        this.dataManager.updateContactProfile(_id, params);
    }

    //#endregion

    /*******************************************************************************/
    // <!-- chat room data listener.
    onChat(data) {
        let chatMessageImp: IMessage = JSON.parse(JSON.stringify(data));
        this.onChatEventListeners.map((value, id, arr) => {
            value(chatMessageImp);
        });
    };

    onLeaveRoom(data) {
        this.onLeaveRoomListeners.map(value => value(data));
    };

    onRoomJoin(data) {

    };

    onMessageRead(dataEvent) {
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach(value => {
                value.onMessageRead(dataEvent);
            });
        }
    };

    onGetMessagesReaders(dataEvent) {
        if (!!this.chatListenerImps && this.chatListenerImps.length !== 0) {
            this.chatListenerImps.forEach(value => {
                value.onGetMessagesReaders(dataEvent);
            });
        }
    };
}