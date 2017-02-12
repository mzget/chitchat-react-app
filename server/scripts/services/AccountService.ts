import * as User from "../models/User";
import * as Room from "../models/Room";


interface IRoomsMap {
    [rid: string]: Room.Room;
}
interface IUsersMap {
    [uid: string]: User.UserTransaction;
}

export class AccountService {

    private app: any;
    private uidMap = {};
    private nameMap = {};
    private channelMap = {};
    /**
     * onLineUsers the dict keep UID of user who online pair with OnlineUser data structure.
     */
    private onlineUsers: User.IOnlineUser;
    public get OnlineUsers(): User.IOnlineUser {
        if (!this.onlineUsers)
            this.onlineUsers = {};

        return this.onlineUsers;
    }
    public getOnlineUser(userId: string, cb: (err: any, user: User.OnlineUser) => void) {
        if (!this.onlineUsers)
            this.onlineUsers = {};

        if (!this.onlineUsers[userId]) {
            let errMsg = "Specific uid is not online.";
            cb(errMsg, null);
            return;
        }

        let user = this.onlineUsers[userId];
        cb(null, user);
    }
    public addOnlineUser(user: User.OnlineUser, callback: Function) {
        console.log("chatService.addOnlineUser");

        if (!this.onlineUsers)
            this.onlineUsers = {};

        if (!this.onlineUsers[user.uid]) {
            this.onlineUsers[user.uid] = user;
        }
        else {
            console.warn("onlineUsers dict already has value.!");
        }

        callback();
    }
    public removeOnlineUser(userId: string) {
        delete this.onlineUsers[userId];
    }

    private _userTransaction: IUsersMap;
    public get userTransaction(): IUsersMap {
        if (!this._userTransaction)
            this._userTransaction = {};

        return this._userTransaction;
    }
}