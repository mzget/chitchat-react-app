import * as User from '../models/User';
import * as Room from '../models/Room';

import redis = require('redis');
import redisClient, { ROOM_MAP_KEY } from './CachingSevice';

interface IRoomsMap {
    [rid: string]: Room.Room;
}
interface IUsersMap {
    [uid: string]: User.UserTransaction;
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
    setRoomsMap(data: Array<any>, callback: () => void) {
        data.forEach(element => {
            let room: Room.Room = JSON.parse(JSON.stringify(element));
            redisClient.hmset(ROOM_MAP_KEY, element._id, JSON.stringify(room), redis.print);
        });

        callback();
    }
    getRoom(roomId: string, callback: (err: any, res: Room.Room) => void) {
        redisClient.hmget(ROOM_MAP_KEY, roomId, function (err, roomMap) {
            console.dir(roomMap);
            if (err || roomMap[0] == null) {
                callback("Have no a roomId in roomMembers dict." + err, null);
            }
            else {
                let room: Room.Room = JSON.parse(roomMap[0]);
                callback(null, room);
            }
        });
    }
    /**
    * Require Room object. Must be { Room._id, Room.members }
    */
    addRoom(room: Room.Room) {
        console.log("addRoom", room);

        redisClient.hmset(ROOM_MAP_KEY, room._id, JSON.stringify(room), redis.print);
    }
}