import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;
import { STALK_INIT_CHATLOG, getLastAccessRoom } from "../chitchat/chats/redux/chatlogs/";
import { TEAM_SELECTED, getTeamsInfo } from "../redux/team/teamRx";
import { FETCH_USER_SUCCESS } from "../redux/user/userRx";
import Store from "../redux/configureStore";
export const stalkInitChatlog_Epic = action$ => action$.filter(action => (action.type == STALK_INIT_CHATLOG || action.type == TEAM_SELECTED))
    .map((x) => {
    if (!!Store.getState().teamReducer.team) {
        let team_id = Store.getState().teamReducer.team._id;
        return getLastAccessRoom(team_id);
    }
    else {
        return { type: "" };
    }
});
export const getTeamsInfo_Epic = (action$) => (action$.filter(action => action.type == FETCH_USER_SUCCESS)
    .map(x => {
    let { userReducer } = Store.getState();
    if (!!userReducer.user.teams && userReducer.user.teams.length > 0) {
        return getTeamsInfo(userReducer.user.teams);
    }
    else {
        return { type: "" };
    }
}));
