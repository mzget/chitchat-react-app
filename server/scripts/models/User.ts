interface IUser {
    uid: string;
};
export class OnlineUser implements IUser {
    uid: string;
    registrationIds: string[];
    username: string;
    serverId: string;
};
export class UserTransaction implements IUser {
    uid: string;
    username: string;
}
export interface IOnlineUser {
    [uid: string]: OnlineUser;
};
export enum UserRole {
    personnel = 0,
    section_chief,
    department_chief,
    division_chief,
    admin
};

export class ChitChatAccount {
    _id: string;
    displayname: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    tel: string;
    email: string;
    avatar: string;
    status: string;
    memberOfRooms: string[];
    lastEditProfile: Date;
    favoriteUsers: string[]; // user_id
    favoriteGroups: string[]; // room_id
    closedNoticeUsers: string[]; // user_id
    closedNoticeGroups: string[]; // room_id
    deviceTokens: string[];
    teams: string[];
    role: UserRole;
};