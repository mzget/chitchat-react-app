"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var async = require("async");
var Room_1 = require("../shared/Room");
var messageDALFactory_1 = require("./dataAccessLayer/messageDALFactory");
var DataManager = (function () {
    function DataManager() {
        this.orgGroups = {};
        this.projectBaseGroups = {};
        this.privateGroups = {};
        this.privateChats = {};
        this.contactsMember = {};
        this.isOrgMembersReady = false;
        this.getContactInfoFailEvents = new Array();
        console.log("userAgent", global.userAgent);
        this.messageDAL = messageDALFactory_1.MessageDALFactory.getObject();
    }
    DataManager.prototype.addContactInfoFailEvents = function (func) {
        this.getContactInfoFailEvents.push(func);
    };
    DataManager.prototype.removeContactInfoFailEvents = function (func) {
        var id = this.getContactInfoFailEvents.indexOf(func);
        this.getContactInfoFailEvents.splice(id, 1);
    };
    // @ Profile...
    DataManager.prototype.getMyProfile = function () {
        return this.myProfile;
    };
    DataManager.prototype.setProfile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.myProfile = data;
                        return [4 /*yield*/, this.myProfile];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DataManager.prototype.setRoomAccessForUser = function (data) {
        if (!!this.myProfile && !!data.roomAccess) {
            this.myProfile.roomAccess = data.roomAccess;
        }
        else {
            this.myProfile = data;
        }
    };
    DataManager.prototype.updateRoomAccessForUser = function (data) {
        if (!this.myProfile.roomAccess)
            return;
        this.myProfile.roomAccess.forEach(function (value) {
            if (value.roomId === data.roomId) {
                value.accessTime = data.accessTime;
                return;
            }
        });
    };
    // public getRoomAccess(): RoomAccessData[] {
    //     return this.myProfile.roomAccess;
    // }
    // <!---------- Group ------------------------------------
    DataManager.prototype.updateGroupImage = function (data) {
        if (!!this.orgGroups[data._id]) {
            this.orgGroups[data._id].image = data.image;
        }
        else if (!!this.projectBaseGroups[data._id]) {
            this.projectBaseGroups[data._id].image = data.image;
        }
        else if (!!this.privateGroups[data._id]) {
            this.privateGroups[data._id].image = data.image;
        }
    };
    DataManager.prototype.updateGroupName = function (data) {
        if (!!this.orgGroups[data._id]) {
            this.orgGroups[data._id].name = data.name;
        }
        else if (!!this.projectBaseGroups[data._id]) {
            this.projectBaseGroups[data._id].name = data.name;
        }
        else if (!!this.privateGroups[data._id]) {
            this.privateGroups[data._id].name = data.name;
        }
    };
    DataManager.prototype.updateGroupMembers = function (data) {
        // <!-- Beware please checking myself before update group members.
        // <!-- May be your id is removed from group.
        var hasMe = this.checkMySelfInNewMembersReceived(data);
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
    };
    DataManager.prototype.updateGroupMemberDetail = function (jsonObj) {
        var _this = this;
        var editMember = jsonObj.editMember;
        var roomId = jsonObj.roomId;
        var groupMember = null;
        groupMember.id = editMember.id;
        var role = editMember.role;
        groupMember.role = Room_1.MemberRole[role];
        groupMember.jobPosition = editMember.jobPosition;
        this.getGroup(roomId).members.forEach(function (value, index, arr) {
            if (value.id === groupMember.id) {
                _this.getGroup(roomId).members[index].role = groupMember.role;
                _this.getGroup(roomId).members[index].textRole = Room_1.MemberRole[groupMember.role];
                _this.getGroup(roomId).members[index].jobPosition = groupMember.jobPosition;
            }
        });
    };
    DataManager.prototype.checkMySelfInNewMembersReceived = function (data) {
        var self = this;
        var hasMe = data.members.some(function isMySelfId(element, index, array) {
            return element.id === self.myProfile._id;
        });
        console.log("New data has me", hasMe);
        return hasMe;
    };
    // <!------------------------------------------------------
    /**
     * Contacts ....
     */
    DataManager.prototype.onUserLogin = function (dataEvent) {
    };
    DataManager.prototype.updateContactImage = function (contactId, url) {
        if (!!this.contactsMember[contactId]) {
            this.contactsMember[contactId].image = url;
        }
    };
    DataManager.prototype.updateContactProfile = function (contactId, params) {
        if (!!this.contactsMember[contactId]) {
            var jsonObj = JSON.parse(JSON.stringify(params));
            if (!!jsonObj.displayname) {
                this.contactsMember[contactId].displayname = jsonObj.displayname;
            }
            if (!!jsonObj.status) {
                this.contactsMember[contactId].status = jsonObj.status;
            }
        }
    };
    DataManager.prototype.setContactProfile = function (contactId, contact) {
        if (!this.contactsMember)
            this.contactsMember = {};
        if (!this.contactsMember[contactId]) {
            this.contactsMember[contactId] = contact;
            if (!!this.contactsProfileChanged)
                this.contactsProfileChanged(contact);
            console.log("Need to save contacts list to persistence data layer.");
        }
    };
    DataManager.prototype.onGetCompanyMemberComplete = function (dataEvent) {
        var self = this;
        var members = JSON.parse(JSON.stringify(dataEvent));
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
    };
    ;
    /**
     * Company...
     */
    DataManager.prototype.onGetCompanyInfo = function (dataEvent) {
    };
    DataManager.prototype.onGetOrganizeGroupsComplete = function (dataEvent) {
        var _this = this;
        var rooms = JSON.parse(JSON.stringify(dataEvent));
        if (!this.orgGroups)
            this.orgGroups = {};
        rooms.forEach(function (value) {
            if (!_this.orgGroups[value._id]) {
                _this.orgGroups[value._id] = value;
            }
        });
        if (this.onOrgGroupDataReady != null) {
            this.onOrgGroupDataReady();
        }
    };
    ;
    DataManager.prototype.onGetProjectBaseGroupsComplete = function (dataEvent) {
        var _this = this;
        var groups = JSON.parse(JSON.stringify(dataEvent));
        if (!this.projectBaseGroups)
            this.projectBaseGroups = {};
        groups.forEach(function (value) {
            if (!_this.projectBaseGroups[value._id]) {
                _this.projectBaseGroups[value._id] = value;
            }
        });
        if (this.onProjectBaseGroupsDataReady != null) {
            this.onProjectBaseGroupsDataReady();
        }
    };
    ;
    DataManager.prototype.onGetPrivateGroupsComplete = function (dataEvent) {
        var _this = this;
        var groups = JSON.parse(JSON.stringify(dataEvent));
        if (!this.privateGroups)
            this.privateGroups = {};
        groups.forEach(function (value) {
            if (!_this.privateGroups[value._id]) {
                _this.privateGroups[value._id] = value;
            }
        });
        if (this.onPrivateGroupsDataReady != null) {
            this.onPrivateGroupsDataReady();
        }
    };
    ;
    DataManager.prototype.onGetMe = function () { };
    DataManager.prototype.isMySelf = function (uid) {
        if (uid === this.myProfile._id)
            return true;
        else
            return false;
    };
    return DataManager;
}());
exports.DataManager = DataManager;
