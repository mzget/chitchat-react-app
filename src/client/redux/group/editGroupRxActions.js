import { createAction } from "redux-actions";
import * as Rx from "rxjs/Rx";
const { ajax } = Rx.Observable;
import { RoomType } from "../../chitchat/shared/Room";
import * as groupService from "../../chitchat/chats/services/groupService";
import { ChitChatFactory } from "../../chitchat/chats/chitchatFactory";
const config = () => ChitChatFactory.getInstance().config;
import Store from "../configureStore";
import { SET_PRIVATE_GROUP } from "./privateGroupRxActions";
import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";
/**
 * Edit group members...
 */
const EDIT_GROUP_MEMBER = "EDIT_GROUP_MEMBER";
export const EDIT_GROUP_MEMBER_SUCCESS = "EDIT_GROUP_MEMBER_SUCCESS";
const EDIT_GROUP_MEMBER_FAILURE = "EDIT_GROUP_MEMBER_FAILURE";
const EDIT_GROUP_MEMBER_CANCELLED = "EDIT_GROUP_MEMBER_CANCELLED";
export const editGroupMember = createAction(EDIT_GROUP_MEMBER, (payload) => payload);
const editGroupMemberSuccess = createAction(EDIT_GROUP_MEMBER_SUCCESS, payload => payload);
const editGroupMemberFailure = createAction(EDIT_GROUP_MEMBER_FAILURE, err => err);
const editGroupMemberCancelled = createAction(EDIT_GROUP_MEMBER_CANCELLED);
export const editGroupMember_Epic = action$ => (action$.ofType(EDIT_GROUP_MEMBER).mergeMap(action => ajax({
    method: "POST",
    url: `${config().api.group}/editMember/${action.payload.room_id}`,
    body: JSON.stringify({ members: action.payload.members }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": Store.getState().authReducer.token
    }
}).map(response => editGroupMemberSuccess(response.xhr.response))
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
})));
/**
 * Add group member...
 *  */
const ADD_GROUP_MEMBER = "ADD_GROUP_MEMBER";
export const ADD_GROUP_MEMBER_SUCCESS = "ADD_GROUP_MEMBER_SUCCESS";
const ADD_GROUP_MEMBER_FAILURE = "ADD_GROUP_MEMBER_FAILURE";
const ADD_GROUP_MEMBER_CANCELLED = "ADD_GROUP_MEMBER_CANCELLED";
export const addGroupMember = createAction(ADD_GROUP_MEMBER, (room_id, member) => ({ room_id, member }));
const addGroupMemberSuccess = createAction(ADD_GROUP_MEMBER_SUCCESS, payload => payload.result);
const addGroupMemberFailure = createAction(ADD_GROUP_MEMBER_FAILURE, error => error);
const addGroupMemberCancelled = createAction(ADD_GROUP_MEMBER_CANCELLED);
export const addGroupMember_Epic = action$ => action$.ofType(ADD_GROUP_MEMBER)
    .mergeMap(action => groupService.addMember(action.payload.room_id, action.payload.member)
    .map(response => addGroupMemberSuccess(response.xhr.response))
    .takeUntil(action$.ofType(ADD_GROUP_MEMBER_CANCELLED))
    .catch(error => Rx.Observable.of(addGroupMemberFailure(error.xhr.response)))
    ._do(response => {
    if (response.type == ADD_GROUP_MEMBER_SUCCESS) {
        let group = response.payload;
        if (group.type == RoomType.privateGroup) {
            let { privateGroups } = Store.getState().groupReducer;
            let newPrivateGroups = privateGroups.map(v => {
                if (v._id == group._id) {
                    v = group;
                }
                return v;
            });
            Store.dispatch({ type: SET_PRIVATE_GROUP, payload: newPrivateGroups });
            Store.dispatch(chatroomActions.updateChatRoom(newPrivateGroups));
        }
    }
}));
/**
 * Remove group members...
 */
const REMOVE_GROUP_MEMBER = "REMOVE_GROUP_MEMBER";
export const REMOVE_GROUP_MEMBER_SUCCESS = "REMOVE_GROUP_MEMBER_SUCCESS";
export const REMOVE_GROUP_MEMBER_FAILURE = "REMOVE_GROUP_MEMBER_FAILURE";
const REMOVE_GROUP_MEMBER_CANCELLED = "REMOVE_GROUP_MEMBER_CANCELLED";
export const removeGroupMember = createAction(REMOVE_GROUP_MEMBER, (room_id, member_id) => ({ room_id, member_id }));
const removeGroupMemberSuccess = createAction(REMOVE_GROUP_MEMBER_SUCCESS, payload => payload.result);
const removeGroupMemberFailure = createAction(REMOVE_GROUP_MEMBER_FAILURE, error => error);
const removeGroupMemberCancelled = createAction(REMOVE_GROUP_MEMBER_CANCELLED);
export const removeGroupMember_Epic = action$ => action$.ofType(REMOVE_GROUP_MEMBER)
    .mergeMap(action => {
    return groupService.removeMember(action.payload.room_id, action.payload.member_id)
        .map(response => removeGroupMemberSuccess(response.xhr.response))
        .takeUntil(action$.ofType(REMOVE_GROUP_MEMBER_CANCELLED))
        .catch(error => Rx.Observable.of(removeGroupMemberFailure(error.xhr.response)))
        ._do(response => {
        if (response.type == REMOVE_GROUP_MEMBER_SUCCESS) {
            let group = response.payload;
            if (group.type == RoomType.privateGroup) {
                let { privateGroups } = Store.getState().groupReducer;
                let newPrivateGroups = privateGroups.map(v => {
                    if (v._id == group._id) {
                        v = group;
                    }
                    return v;
                });
                Store.dispatch({ type: SET_PRIVATE_GROUP, payload: newPrivateGroups });
                Store.dispatch(chatroomActions.updateChatRoom(newPrivateGroups));
            }
        }
    });
});
/**
 * Group details...
 */
const EDIT_GROUP_DETAIL = "EDIT_GROUP_DETAIL";
export const EDIT_GROUP_DETAIL_SUCCESS = "EDIT_GROUP_DETAIL_SUCCESS";
export const EDIT_GROUP_DETAIL_FAILURE = "EDIT_GROUP_DETAIL_FAILURE";
const EDIT_GROUP_DETAIL_CANCELLED = "EDIT_GROUP_DETAIL_CANCELLED";
export const editGroupDetail = createAction(EDIT_GROUP_DETAIL, (room) => room);
const editGroupDetailSuccess = createAction(EDIT_GROUP_DETAIL_SUCCESS, payload => payload);
const editGroupDetailFailure = createAction(EDIT_GROUP_DETAIL_FAILURE, error => error);
const editGroupDetailCancelled = createAction(EDIT_GROUP_DETAIL_CANCELLED);
export const editGroupDetail_Epic = action$ => (action$.ofType(EDIT_GROUP_DETAIL).mergeMap(action => ajax({
    method: "POST",
    url: `${config().api.group}/update`,
    body: JSON.stringify({ room: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": Store.getState().authReducer.token
    }
}).map(response => editGroupDetailSuccess(response.xhr.response))
    .takeUntil(action$.ofType(EDIT_GROUP_DETAIL_CANCELLED))
    .catch(error => Rx.Observable.of(editGroupDetailFailure(error.xhr.response)))));
