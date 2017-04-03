"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async = require("async");
const Room_1 = require("../libs/shared/Room");
const RoomDALFactory_1 = require("./dataAccessLayer/RoomDALFactory");
const messageDALFactory_1 = require("./dataAccessLayer/messageDALFactory");
class DataManager {
    constructor() {
        this.orgGroups = {};
        this.projectBaseGroups = {};
        this.privateGroups = {};
        this.privateChats = {};
        this.contactsMember = {};
        this.isOrgMembersReady = false;
        this.getContactInfoFailEvents = new Array();
        this.roomDAL = RoomDALFactory_1.RoomDALFactory.getObject();
        this.messageDAL = messageDALFactory_1.MessageDALFactory.getObject();
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
        return new Promise((resolve, reject) => {
            this.myProfile = data;
            resolve(this.myProfile);
        });
    }
    setRoomAccessForUser(data) {
        if (!!data.roomAccess) {
            this.myProfile.roomAccess = data.roomAccess;
        }
    }
    updateRoomAccessForUser(data) {
        let arr = JSON.parse(JSON.stringify(data.roomAccess));
        if (!this.myProfile) {
            this.myProfile = {};
            this.myProfile.roomAccess = arr;
        }
        else {
            if (!this.myProfile.roomAccess) {
                this.myProfile.roomAccess = arr;
            }
            else {
                this.myProfile.roomAccess.forEach(value => {
                    if (value.roomId === arr[0].roomId) {
                        value.accessTime = arr[0].accessTime;
                        return;
                    }
                });
            }
        }
    }
    getRoomAccess() {
        return this.myProfile.roomAccess;
    }
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
        if (data.type === Room_1.RoomType.organizationGroup) {
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
        else if (data.type === Room_1.RoomType.projectBaseGroup) {
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
        else if (data.type === Room_1.RoomType.privateGroup) {
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
        groupMember.role = Room_1.MemberRole[role];
        groupMember.jobPosition = editMember.jobPosition;
        this.getGroup(roomId).members.forEach((value, index, arr) => {
            if (value.id === groupMember.id) {
                this.getGroup(roomId).members[index].role = groupMember.role;
                this.getGroup(roomId).members[index].textRole = Room_1.MemberRole[groupMember.role];
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
exports.default = DataManager;
