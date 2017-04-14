import { Room } from "../../libs/shared/Room";

export interface ITeam {
    _id: string;
    name: string;
    detail: string;
    image: string;
    jobPosition: string[];
    defaultGroup: Room;
    groups: string[];
    createAt: Date;
}