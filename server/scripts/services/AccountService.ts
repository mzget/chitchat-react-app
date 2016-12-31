import * as User from '../models/User';
import * as Room from '../models/Room';

interface IRoomsMap {
    [rid: string]: Room.Room;
}
interface IUsersMap {
    [uid: string]: User.UserTransaction
}

export default class AccountService {

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

    /**
     * roomMembers the dict for keep roomId pair with array of uid who is a member of room.
     */
    private roomsMap: IRoomsMap;
    public get RoomsMap(): IRoomsMap {
        return this.roomsMap;
    }
    setRoomsMap(data: Array<any>, callback) {
        console.log("ChatService.setRoomMembers");

        if (!this.roomsMap)
            this.roomsMap = {};

        data.forEach(element => {
            var room: Room.Room = JSON.parse(JSON.stringify(element));
            if (!this.roomsMap[element.id]) {
                this.roomsMap[element._id] = room;
            }
        });

        callback();
    }
    getRoom(roomId: string, callback: (err: any, res: Room.Room) => void) {
        if (!this.roomsMap[roomId]) {
            callback("Have no a roomId in roomMembers dict.", null);
            return;
        }

        let room = this.roomsMap[roomId];
        callback(null, room);
    }

    /**
    * Require Room object. Must be { Room._id, Room.members }
    */
    addRoom(data) {
        let room: Room.Room = JSON.parse(JSON.stringify(data));
        if (!this.roomsMap[room._id]) {
            this.roomsMap[room._id] = room;
        }
        else {
            this.roomsMap[room._id] = room;
        }
    }
}