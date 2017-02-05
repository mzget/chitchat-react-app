import config from "../../configs/config";
import * as Rx from "rxjs/Rx";

export function getTeamProfile(token: string, team_id: string) {
    return Rx.Observable.ajax({
        url: `${config.api.user}/teamProfile?team_id=${team_id}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": token
        }
    });
}

export function setOrgChartId(token: string, user: any, team_id: string, orgChartId: string) {
    return Rx.Observable.ajax({
        method: "POST",
        url: `${config.api.user}/setOrgChartId`,
        body: JSON.stringify({
            user_id: user._id,
            username: user.username,
            team_id: team_id,
            org_chart_id: orgChartId
        }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
}