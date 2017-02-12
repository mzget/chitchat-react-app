import { ChitChatAccount } from "../../../server/scripts/models/User";
import { ITeamProfile } from "../../../server/scripts/models/TeamProfile";

export class ITeamMember extends ChitChatAccount {
    _id: string;
    displayname: string;
    username: string;
    firstname: string;
    lastname: string;
    tel: string;
    email: string;
    avatar: string;
    teamProfiles: Array<ITeamProfile>;
}