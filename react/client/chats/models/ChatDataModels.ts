/**
 * @ Room
 */
type IMembersStatus = {
    uid: string;
    status: string;
};
export enum RoomType { organizationGroup = 0, projectBaseGroup, privateGroup, privateChat };
enum RoomStatus { active, disable, delete };

export type RoomAccessData = {
    roomId: string;
    accessTime: Date;
};

export interface IMember {
    _id: string;
    username: string;
    joinTime: Date;
    status: string;
}

export enum MemberRole {
    member, admin
}

/**
 * @ ContentType
 */
export enum ContentType {
    Unload,
    File,
    Text,
    Voice,
    Image,
    Video,
    Sticker,
    Location
}

/**
 * @ContactInfo...
 */
export type ContactInfo = {
    _id: string;
    displayname: string;
    status: string;
    image: string;
};

/**
 * @Message...
 */
export interface IMessage {
    _id: string;
    rid: string;
    type: string;
    body: string;
    sender: string;
    createTime: Date;
    readers: string[];
    meta: IMessageMeta;
    target: string;
}
export interface IMessageMeta {
    duration?: string;
    thumbnail?: string;
    name?: string;
    mimetype: string;
    size: number;
}

/**
 * @StlakAccount...
 */
export class StalkAccount {
    _id: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    tel: string;
    email: string;
    image: string; // !-- mean image url.
    status: string;
    roomAccess: RoomAccessData[];
    memberOfRooms: string[];
    lastEditProfile: Date;
    favoriteUsers: string[]; // user_id
    favoriteGroups: string[]; // room_id
    closedNoticeUsers: string[]; // user_id
    closedNoticeGroups: string[]; // room_id
    deviceTokens: string[];
};