import { ChitChatAccount } from "../../../server/scripts/models/User";

export abstract class ITeamMember implements ChitChatAccount {
    _id: string;
    displayname: string;
    username: string;
    firstname: string;
    lastname: string;
    tel: string;
    email: string;
    avatar: string;
}