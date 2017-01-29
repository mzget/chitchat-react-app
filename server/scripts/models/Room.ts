export enum MemberRole {
    member = 0,
    admin = 1,
    owner
}
export interface IMembersStatus {
    uid: string;
    status: string;
}
export class Member {
    _id: string;
    room_role: MemberRole;
    user_role: string;
    username: string;
    joinTime: Date;
    status: string;
    jobPosition: string;
}
export enum RoomType { organizationGroup, projectBaseGroup, privateGroup, privateChat };
export enum RoomStatus { active, disable, delete };
export class Room {
    _id: any;
    name: string;
    type: RoomType;
    members: Member[];
    image: string;
    description: string;
    status: RoomStatus;
    createTime: Date;
    org_chart_id: string;
    team_id: any;
}