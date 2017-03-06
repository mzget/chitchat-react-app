import config from "../../configs/config";
import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;

import Store from "../configureStore";

import { Room, RoomType, IMember } from "../../../server/scripts/models/Room";

const EDIT_GROUP_MEMBER = "EDIT_GROUP_MEMBER";
export const EDIT_GROUP_MEMBER_SUCCESS = "EDIT_GROUP_MEMBER_SUCCESS";
const EDIT_GROUP_MEMBER_FAILURE = "EDIT_GROUP_MEMBER_FAILURE";
const EDIT_GROUP_MEMBER_CANCELLED = "EDIT_GROUP_MEMBER_CANCELLED";
export const editGroupMember = createAction(EDIT_GROUP_MEMBER, (payload: { room_id: string, members: Array<IMember> }) => payload);
const editGroupMemberSuccess = createAction(EDIT_GROUP_MEMBER_SUCCESS, payload => payload);
const editGroupMemberFailure = createAction(EDIT_GROUP_MEMBER_FAILURE, err => err);
const editGroupMemberCancelled = createAction(EDIT_GROUP_MEMBER_CANCELLED);
export const editGroupMember_Epic = action$ => (
    action$.ofType(EDIT_GROUP_MEMBER).mergeMap(action =>
        ajax({
            method: "POST",
            url: `${config.api.group}/org/create`,
            body: JSON.stringify({ room: action.payload }),
            headers: {
                "Content-Type": "application/json",
                "x-access-token": Store.getState().authReducer.token
            }
        }).map(response => editGroupMemberSuccess(response))
            .takeUntil(action$.ofType(EDIT_GROUP_MEMBER_CANCELLED))
            .catch(error => Rx.Observable.of(editGroupMemberFailure(error.xhr.response)))
            .do(response => {
                // if (response.type == GET_ORG_GROUP_SUCCESS) {
                //     const dataManager = BackendFactory.getInstance().dataManager;
                //     let rooms = response.payload.result as Array<Room>;
                //     Rx.Observable.from(rooms)._do(x => {
                //         dataManager.roomDAL.save(x._id, x);
                //     }).subscribe();
                // }
            })
    ));