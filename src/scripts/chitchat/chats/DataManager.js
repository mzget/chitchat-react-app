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
        let self = this;
        MessageDALFactory.getObject().then(storage => {
            self.messageDAL = storage;
        }).catch(err => {
            console.warn("Cannot get properly storage engine.");
        });
    }
    addContactInfoFailEvents(func) {
        this.getContactInfoFailEvents.push(func);
    }
    removeContactInfoFailEvents(func) {
        let id = this.getContactInfoFailEvents.indexOf(func);
        this.getContactInfoFailEvents.splice(id, 1);
    }
    // @ Profile...
    async setProfile(data) {
        this.myProfile = data;
        return await this.myProfile;
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
