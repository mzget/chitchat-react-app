import mongodb = require("mongodb");
type ObjectID = mongodb.ObjectID;

import JobLevel from "./JobLevel";
import { UserRole } from "./UserRole";

export interface ITeamProfile {
    _id: string;
    user_id: ObjectID;
    team_id: ObjectID;
    org_chart_id: ObjectID;
    jobLevel: JobLevel;
    jobPosition: string;
    team_role: UserRole;
}