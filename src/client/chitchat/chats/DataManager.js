var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MessageDALFactory } from "./dataAccessLayer/";
export class DataManager {
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
    setProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.myProfile = data;
            return yield this.myProfile;
        });
    }
    isMySelf(uid) {
        if (uid === this.myProfile._id)
            return true;
        else
            return false;
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
        if (!this.myProfile.roomAccess) {
            return;
        }
        this.myProfile.roomAccess.forEach(value => {
            if (value.roomId === data.roomId) {
                value.accessTime = data.accessTime;
                return;
            }
        });
    }
    onUserLogin(dataEvent) {
    }
}
