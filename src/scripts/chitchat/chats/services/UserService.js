import * as Rx from "rxjs/Rx";
import InternalStore, { apiHeaders } from "stalk-simplechat";
const { ajax } = Rx.Observable;
const getConfig = () => InternalStore.apiConfig;
export function getTeamProfile(token, team_id) {
    return Rx.Observable.ajax({
        url: `${getConfig().user}/teamProfile?team_id=${team_id}`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    });
}
export function setOrgChartId(token, user, team_id, orgChartId) {
    return Rx.Observable.ajax({
        method: "POST",
        url: `${getConfig().user}/setOrgChartId`,
        body: JSON.stringify({
            user_id: user._id,
            username: user.username,
            team_id,
            org_chart_id: orgChartId,
        }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    });
}
export function updateTeamProfile(user_id, team_id, profile) {
    return Rx.Observable.ajax({
        method: "POST",
        url: `${getConfig().user}/teamProfile/${team_id}/${user_id}`,
        body: JSON.stringify({
            profile,
        }),
        headers: apiHeaders(),
    });
}
export function fetchUser(username) {
    return ajax({
        method: "GET",
        url: `${getConfig().user}/?username=${username}`,
        headers: apiHeaders(),
    });
}
export function suggestUser(username, team_id) {
    return ajax({
        method: "GET",
        url: `${getConfig().user}/suggest/?username=${username}&team_id=${team_id}`,
        headers: apiHeaders(),
    });
}
export function saveDevice(registration_id, user_id) {
    return ajax({
        method: "POST",
        url: `${getConfig().user}/saveDevice/`,
        headers: apiHeaders(),
        body: JSON.stringify({
            deviceToken: registration_id,
            user_id,
        }),
    });
}
