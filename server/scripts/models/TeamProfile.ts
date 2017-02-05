import JobLevel from "./JobLevel";
import UserRole from "./UserRole";

export interface ITeamProfile {
    _id: string;
    user_id: string;
    team_id: string;
    org_chart_id: string;
    jobLevel: JobLevel;
    jobPosition: string;
    role: UserRole;
}