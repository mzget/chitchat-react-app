import { IMember } from "./ChatDataModels";

export class Member implements IMember {
    _id: string;
    username: string;
    joinTime: any;
    status: any;

    user_role: string;
}