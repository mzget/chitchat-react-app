"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../configs/config");
const Rx = require("rxjs/Rx");
function getTeamProfile(token, team_id) {
    return Rx.Observable.ajax({
        url: `${config_1.default.api.user}/teamProfile?team_id=${team_id}`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
}
exports.getTeamProfile = getTeamProfile;
function setOrgChartId(token, user, team_id, orgChartId) {
    return Rx.Observable.ajax({
        method: "POST",
        url: `${config_1.default.api.user}/setOrgChartId`,
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
exports.setOrgChartId = setOrgChartId;
