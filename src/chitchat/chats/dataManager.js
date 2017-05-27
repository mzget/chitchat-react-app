var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as async from "async";
import { RoomType, MemberRole } from "../shared/Room";
import { MessageDALFactory } from "./dataAccessLayer/messageDALFactory";
export default class DataManager {
    constructor() {
        this.orgGroups = {};
        this.projectBaseGroups = {};
        this.privateGroups = {};
        this.privateChats = {};
        this.contactsMember = {};
        this.isOrgMembersReady = false;
        this.getContactInfoFailEvents = new Array();
        console.log("userAgent", global.userAgent);
        this.messageDAL = MessageDALFactory.getObject();
    }
    addContactInfoFailEvents(func) {
        this.getContactInfoFailEvents.push(func);
    }
    removeContactInfoFailEvents(func) {
        let id = this.getContactInfoFailEvents.indexOf(func);
        this.getContactInfoFailEvents.splice(id, 1);
    }
    // @ Profile...
    getMyProfile() {
        return this.myProfile;
    }
    setProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.myProfile = data;
            return yield this.myProfile;
        });
    }
    setRoomAccessForUser(data) {
        if (!!this.myProfile && !!data.roomAccess) {
            this.myProfile.roomAccess = data.roomAccess;
        }
        else {
            this.myProfile = data;
        }
    }
    updateRoomAccessForUser(data) {
        if (!this.myProfile.roomAccess)
            return;
        this.myProfile.roomAccess.forEach(value => {
            if (value.roomId === data.roomId) {
                value.accessTime = data.accessTime;
                return;
            }
        });
    }
    // public getRoomAccess(): RoomAccessData[] {
    //     return this.myProfile.roomAccess;
    // }
    // <!---------- Group ------------------------------------
    updateGroupImage(data) {
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
    updateGroupName(data) {
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
    updateGroupMembers(data) {
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
    updateGroupMemberDetail(jsonObj) {
        let editMember = jsonObj.editMember;
        let roomId = jsonObj.roomId;
        let groupMember = null;
        groupMember.id = editMember.id;
        let role = editMember.role;
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
    checkMySelfInNewMembersReceived(data) {
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
    onUserLogin(dataEvent) {
        console.log("user logedIn", JSON.stringify(dataEvent));
        let jsonObject = JSON.parse(JSON.stringify(dataEvent));
        let _id = jsonObject._id;
        let self = this;
        if (!this.contactsMember)
            this.contactsMember = {};
        if (!this.contactsMember[_id]) {
        }
    }
    updateContactImage(contactId, url) {
        if (!!this.contactsMember[contactId]) {
            this.contactsMember[contactId].image = url;
        }
    }
    updateContactProfile(contactId, params) {
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
    setContactProfile(contactId, contact) {
        if (!this.contactsMember)
            this.contactsMember = {};
        if (!this.contactsMember[contactId]) {
            this.contactsMember[contactId] = contact;
            if (!!this.contactsProfileChanged)
                this.contactsProfileChanged(contact);
            console.log("Need to save contacts list to persistence data layer.");
        }
    }
    onGetCompanyMemberComplete(dataEvent) {
        let self = this;
        let members = JSON.parse(JSON.stringify(dataEvent));
        if (!this.contactsMember)
            this.contactsMember = {};
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
    }
    ;
    /**
     * Company...
     */
    onGetCompanyInfo(dataEvent) {
    }
    onGetOrganizeGroupsComplete(dataEvent) {
        let rooms = JSON.parse(JSON.stringify(dataEvent));
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
    }
    ;
    onGetProjectBaseGroupsComplete(dataEvent) {
        let groups = JSON.parse(JSON.stringify(dataEvent));
        if (!this.projectBaseGroups)
            this.projectBaseGroups = {};
        groups.forEach(value => {
            if (!this.projectBaseGroups[value._id]) {
                this.projectBaseGroups[value._id] = value;
            }
        });
        if (this.onProjectBaseGroupsDataReady != null) {
            this.onProjectBaseGroupsDataReady();
        }
    }
    ;
    onGetPrivateGroupsComplete(dataEvent) {
        let groups = JSON.parse(JSON.stringify(dataEvent));
        if (!this.privateGroups)
            this.privateGroups = {};
        groups.forEach(value => {
            if (!this.privateGroups[value._id]) {
                this.privateGroups[value._id] = value;
            }
        });
        if (this.onPrivateGroupsDataReady != null) {
            this.onPrivateGroupsDataReady();
        }
    }
    ;
    onGetMe() { }
    isMySelf(uid) {
        if (uid === this.myProfile._id)
            return true;
        else
            return false;
    }
}
