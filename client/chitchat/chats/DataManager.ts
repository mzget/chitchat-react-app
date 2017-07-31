import * as async from "async";
import { StalkEvents } from "stalk-js";

import { StalkAccount, RoomAccessData } from "../shared/Stalk";

import { ContactInfo } from "./models/Contact";
import { RoomType, MemberRole, Room } from "./models/Room";

import { IRoomDAL } from "./dataAccessLayer/IRoomDAL";
import { RoomDALFactory } from "./dataAccessLayer/RoomDALFactory";
import { IMessageDAL, MessageDALFactory } from "./dataAccessLayer/";

interface IRoomMap {
    [key: string]: Room;
}
interface IMemberMep {
    [key: string]: ContactInfo;
}

export class DataManager {
    private myProfile: StalkAccount;
    public orgGroups: IRoomMap = {};
    public projectBaseGroups: IRoomMap = {};
    public privateGroups: IRoomMap = {};
    public privateChats: IRoomMap = {};
    private contactsMember: IMemberMep = {};
    public isOrgMembersReady: boolean = false;
    public onMyProfileReady: (dataManager: DataManager) => void;

    public onOrgGroupDataReady: () => void;
    public onProjectBaseGroupsDataReady: () => void;
    public onPrivateGroupsDataReady: () => void;
    public onContactsDataReady: () => void;
    public contactsProfileChanged: (contact: ContactInfo) => void;
    public getContactInfoFailEvents: Array<(contact_id: string) => void> = new Array();
    public addContactInfoFailEvents(func: (contact_id: string) => void) {
        this.getContactInfoFailEvents.push(func);
    }
    public removeContactInfoFailEvents(func: (contact_id: string) => void) {
        let id = this.getContactInfoFailEvents.indexOf(func);
        this.getContactInfoFailEvents.splice(id, 1);
    }

    public messageDAL: IMessageDAL;

    constructor() {
        console.log("userAgent", global.userAgent);

        this.messageDAL = MessageDALFactory.getObject();
    }

    // @ Profile...
    public async setProfile(data: StalkAccount) {
        this.myProfile = data;

        return await this.myProfile;
    }
    public isMySelf(uid: string): boolean {
        if (uid === this.myProfile._id) return true;
        else return false;
    }

    public setRoomAccessForUser(data: StalkAccount) {
        if (!!this.myProfile && !!data.roomAccess) {
            this.myProfile.roomAccess = data.roomAccess;
        }
        else {
            this.myProfile = data;
        }
    }
    public updateRoomAccessForUser(data: RoomAccessData) {
        if (!this.myProfile.roomAccess) { return; }

        this.myProfile.roomAccess.forEach(value => {
            if (value.roomId === data.roomId) {
                value.accessTime = data.accessTime;

                return;
            }
        });
    }

    public onUserLogin(dataEvent) {
    }
}