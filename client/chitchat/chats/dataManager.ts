import * as async from "async";

import { absSpartan } from "../libs/stalk/spartanEvents";
import { ServerImplemented } from "../libs/stalk/serverImplemented";
import { RoomType, MemberRole, Room } from "../libs/shared/Room";
import { StalkAccount, RoomAccessData } from "../libs/shared/Stalk";

import { ContactInfo } from "./models/Contact";

import { IRoomDAL } from "./dataAccessLayer/IRoomDAL";
import { RoomDALFactory } from "./dataAccessLayer/RoomDALFactory";
import { IMessageDAL } from "./dataAccessLayer/IMessageDAL";
import { MessageDALFactory } from "./dataAccessLayer/messageDALFactory";

interface IRoomMap {
    [key: string]: Room;
}
interface IMemberMep {
    [key: string]: ContactInfo;
}

export default class DataManager implements absSpartan.IFrontendServerListener {
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
        this.messageDAL = MessageDALFactory.getObject();
    }

    // @ Profile...
    public getMyProfile(): StalkAccount {
        return this.myProfile;
    }
    public setProfile(data: StalkAccount): Promise<StalkAccount> {
        return new Promise((resolve, reject) => {
            this.myProfile = data;
            resolve(this.myProfile);
        });
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
        this.myProfile.roomAccess.forEach(value => {
            if (value.roomId === data.roomId) {
                value.accessTime = data.accessTime;

                return;
            }
        });
    }

    public getRoomAccess(): RoomAccessData[] {
        return this.myProfile.roomAccess;
    }

    // <!---------- Group ------------------------------------
    public updateGroupImage(data: Room) {
        if (!!this.orgGroups[data._id]) {
            this.orgGroups[data._id].image = data.image;
        }
        else if (!!this.projectBaseGroups[data._id]) {
            this.projectBaseGroups[data._id].image = data.image;
        }
        else if (!!this.privateGroups[data._id]) {
            this.privateGroups[data._id].image = data.image;
        }
    }
    public updateGroupName(data: Room) {
        if (!!this.orgGroups[data._id]) {
            this.orgGroups[data._id].name = data.name;
        }
        else if (!!this.projectBaseGroups[data._id]) {
            this.projectBaseGroups[data._id].name = data.name;
        }
        else if (!!this.privateGroups[data._id]) {
            this.privateGroups[data._id].name = data.name;
        }
    }
    public updateGroupMembers(data: Room) {
        // <!-- Beware please checking myself before update group members.
        // <!-- May be your id is removed from group.
        let hasMe = this.checkMySelfInNewMembersReceived(data);

        if (data.type === RoomType.organizationGroup) {
            if (!!this.orgGroups[data._id]) {
                // <!-- This statement call when current you still a member.
                if (hasMe) {
                    this.orgGroups[data._id].members = data.members;
                }
                else {
                    console.warn("this org group is not contain me in members list.");
                }
            }
            else {
                this.orgGroups[data._id] = data;
            }
        }
        else if (data.type === RoomType.projectBaseGroup) {
            if (!!this.projectBaseGroups[data._id]) {
                if (hasMe) {
                    this.projectBaseGroups[data._id].visibility = true;
                    this.projectBaseGroups[data._id].members = data.members;
                }
                else {
                    this.projectBaseGroups[data._id].visibility = false;
                }
            }
            else {
                this.projectBaseGroups[data._id] = data;
            }
        }
        else if (data.type === RoomType.privateGroup) {
            if (!!this.privateGroups[data._id]) {
                if (hasMe) {
                    this.privateGroups[data._id].visibility = true;
                    this.privateGroups[data._id].members = data.members;
                }
                else {
                    this.privateGroups[data._id].visibility = false;
                }
            }
            else {
                console.debug("new group", data.name);
                this.privateGroups[data._id] = data;
            }
        }

        console.log("dataManager.updateGroupMembers:");
    }
    public updateGroupMemberDetail(jsonObj: any) {
        let editMember = jsonObj.editMember;
        let roomId = jsonObj.roomId;

        let groupMember: Member = null;
        groupMember.id = editMember.id;
        let role = <string>editMember.role;
        groupMember.role = MemberRole[role];
        groupMember.jobPosition = editMember.jobPosition;

        this.getGroup(roomId).members.forEach((value, index, arr) => {
            if (value.id === groupMember.id) {
                this.getGroup(roomId).members[index].role = groupMember.role;
                this.getGroup(roomId).members[index].textRole = MemberRole[groupMember.role];
                this.getGroup(roomId).members[index].jobPosition = groupMember.jobPosition;
            }
        });
    }

    private checkMySelfInNewMembersReceived(data: Room): boolean {
        let self = this;
        let hasMe = data.members.some(function isMySelfId(element, index, array) {
            return element.id === self.myProfile._id;
        });

        console.log("New data has me", hasMe);
        return hasMe;
    }

    // <!------------------------------------------------------

    /**
     * Contacts ....
     */
    public onUserLogin(dataEvent) {
        console.log("user logedIn", JSON.stringify(dataEvent));
        let jsonObject = JSON.parse(JSON.stringify(dataEvent));
        let _id: string = jsonObject._id;
        let self = this;

        if (!this.contactsMember) this.contactsMember = {};
        if (!this.contactsMember[_id]) {
            // @ Need to get new contact info.
            /*
            ServerImplemented.getInstance().getMemberProfile(_id, (err, res) => {
                console.log("getMemberProfile : ", err, JSON.stringify(res));

                let data = JSON.parse(JSON.stringify(res.data));
                let contact: ContactInfo = new ContactInfo();
                contact._id = data._id;
                contact.displayname = data.displayname;
                contact.image = data.image;
                contact.status = data.status;

                console.warn(contact);
                self.contactsMember[contact._id] = contact;

                if (self.onContactsDataReady != null) {
                    self.onContactsDataReady();
                }

                console.log("We need to save contacts list to persistence data layer.");
            });
            */
        }
    }
    public updateContactImage(contactId: string, url: string) {
        if (!!this.contactsMember[contactId]) {
            this.contactsMember[contactId].image = url;
        }
    }
    public updateContactProfile(contactId: string, params: any) {
        if (!!this.contactsMember[contactId]) {
            let jsonObj = JSON.parse(JSON.stringify(params));
            if (!!jsonObj.displayname) {
                this.contactsMember[contactId].displayname = jsonObj.displayname;
            }
            if (!!jsonObj.status) {
                this.contactsMember[contactId].status = jsonObj.status;
            }
        }
    }
    public setContactProfile(contactId: string, contact: ContactInfo) {
        if (!this.contactsMember)
            this.contactsMember = {};

        if (!this.contactsMember[contactId]) {
            this.contactsMember[contactId] = contact;

            if (!!this.contactsProfileChanged)
                this.contactsProfileChanged(contact);

            console.log("Need to save contacts list to persistence data layer.");
        }
    }
    public onGetCompanyMemberComplete(dataEvent) {
        let self = this;
        let members: Array<ContactInfo> = JSON.parse(JSON.stringify(dataEvent));

        if (!this.contactsMember) this.contactsMember = {};

        async.eachSeries(members, function iterator(item, cb) {
            if (!self.contactsMember[item._id]) {
                self.contactsMember[item._id] = item;
            }

            cb();
        }, function done(err) {
            self.isOrgMembersReady = true;
        });

        if (this.onContactsDataReady != null)
            this.onContactsDataReady();
    };

    /**
     * Company...
     */
    public onGetCompanyInfo(dataEvent) {

    }
    public onGetOrganizeGroupsComplete(dataEvent) {
        let rooms: Array<Room> = JSON.parse(JSON.stringify(dataEvent));
        if (!this.orgGroups)
            this.orgGroups = {};

        rooms.forEach(value => {
            if (!this.orgGroups[value._id]) {
                this.orgGroups[value._id] = value;
            }
        });

        if (this.onOrgGroupDataReady != null) {
            this.onOrgGroupDataReady();
        }
    };
    public onGetProjectBaseGroupsComplete(dataEvent) {
        let groups: Array<Room> = JSON.parse(JSON.stringify(dataEvent));

        if (!this.projectBaseGroups) this.projectBaseGroups = {};

        groups.forEach(value => {
            if (!this.projectBaseGroups[value._id]) {
                this.projectBaseGroups[value._id] = value;
            }
        });

        if (this.onProjectBaseGroupsDataReady != null) {
            this.onProjectBaseGroupsDataReady();
        }
    };
    public onGetPrivateGroupsComplete(dataEvent) {
        let groups: Array<Room> = JSON.parse(JSON.stringify(dataEvent));

        if (!this.privateGroups) this.privateGroups = {};

        groups.forEach(value => {
            if (!this.privateGroups[value._id]) {
                this.privateGroups[value._id] = value;
            }
        });

        if (this.onPrivateGroupsDataReady != null) {
            this.onPrivateGroupsDataReady();
        }
    };

    onGetMe() { }

    public isMySelf(uid: string): boolean {
        if (uid === this.myProfile._id) return true;
        else return false;
    }
}