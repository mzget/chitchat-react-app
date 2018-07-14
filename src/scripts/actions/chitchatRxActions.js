/**
 * Copyright 2017 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import { STALK_INIT_CHATLOG, getLastAccessRoom } from "stalk-simplechat";
import { STALK_INIT_SUCCESS } from "stalk-simplechat/app/redux/stalkBridge/stalkBridgeActions";
import { initChatsLog } from "stalk-simplechat/app/redux/chatlogs/chatlogsActions";
import { TEAM_SELECTED, getTeamsInfo } from "../redux/team/teamRx";
import { FETCH_USER_SUCCESS } from "../redux/user/userRx";
import Store from "../redux/configureStore";
export const stalkInitSuccessEpic = (action$) => action$.ofType(STALK_INIT_SUCCESS).map((x) => {
    initChatsLog();
    return { type: "" };
});
export const stalkInitChatlogEpic = (action$) => action$.filter((action) => (action.type === STALK_INIT_CHATLOG || action.type === TEAM_SELECTED))
    .map((x) => {
    if (!!Store.getState().teamReducer.team) {
        const teamId = Store.getState().teamReducer.team._id;
        return getLastAccessRoom(teamId);
    }
    else {
        return { type: "" };
    }
});
export const getTeamsInfoEpic = (action$) => (action$.filter((action) => action.type === FETCH_USER_SUCCESS)
    .map((x) => {
    const { userReducer } = Store.getState();
    if (!!userReducer.user.teams && userReducer.user.teams.length > 0) {
        return getTeamsInfo(userReducer.user.teams);
    }
    else {
        return { type: "WAIT_FOR_USER_TEAMS" };
    }
}));
