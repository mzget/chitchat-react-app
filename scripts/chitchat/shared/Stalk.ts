export class RoomAccessData {
    roomId: string;
    accessTime: Date;
};

export interface StalkAccount {
    _id: string;
    username: string;
    roomAccess: Array<RoomAccessData>;
}