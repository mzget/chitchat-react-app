"use strict";
const redux_actions_1 = require("redux-actions");
const Rx = require("rxjs/Rx");
const { ajax } = Rx.Observable;
const groupService_1 = require("../../chitchat/chats/services/groupService");
const chitchatFactory_1 = require("../../chitchat/chats/chitchatFactory");
const config = () => chitchatFactory_1.ChitChatFactory.getInstance().config;
const configureStore_1 = require("../configureStore");
const EDIT_GROUP_MEMBER = "EDIT_GROUP_MEMBER";
exports.EDIT_GROUP_MEMBER_SUCCESS = "EDIT_GROUP_MEMBER_SUCCESS";
const EDIT_GROUP_MEMBER_FAILURE = "EDIT_GROUP_MEMBER_FAILURE";
const EDIT_GROUP_MEMBER_CANCELLED = "EDIT_GROUP_MEMBER_CANCELLED";
exports.editGroupMember = redux_actions_1.createAction(EDIT_GROUP_MEMBER, (payload) => payload);
const editGroupMemberSuccess = redux_actions_1.createAction(exports.EDIT_GROUP_MEMBER_SUCCESS, payload => payload);
const editGroupMemberFailure = redux_actions_1.createAction(EDIT_GROUP_MEMBER_FAILURE, err => err);
const editGroupMemberCancelled = redux_actions_1.createAction(EDIT_GROUP_MEMBER_CANCELLED);
exports.editGroupMember_Epic = action$ => (action$.ofType(EDIT_GROUP_MEMBER).mergeMap(action => ajax({
    method: "POST",
    url: `${config().api.group}/editMember/${action.payload.room_id}`,
    body: JSON.stringify({ members: action.payload.members }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1.default.getState().authReducer.token
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
const ADD_GROUP_MEMBER = "ADD_GROUP_MEMBER";
exports.ADD_GROUP_MEMBER_SUCCESS = "ADD_GROUP_MEMBER_SUCCESS";
const ADD_GROUP_MEMBER_FAILURE = "ADD_GROUP_MEMBER_FAILURE";
const ADD_GROUP_MEMBER_CANCELLED = "ADD_GROUP_MEMBER_CANCELLED";
exports.addGroupMember = redux_actions_1.createAction(ADD_GROUP_MEMBER, (room_id, member) => ({ room_id, member }));
const addGroupMemberSuccess = redux_actions_1.createAction(exports.ADD_GROUP_MEMBER_SUCCESS, payload => payload);
const addGroupMemberFailure = redux_actions_1.createAction(ADD_GROUP_MEMBER_FAILURE, error => error);
const addGroupMemberCancelled = redux_actions_1.createAction(ADD_GROUP_MEMBER_CANCELLED);
exports.addGroupMember_Epic = action$ => (action$.ofType(ADD_GROUP_MEMBER)
    .mergeMap(action => groupService_1.addMember(action.payload.room_id, action.payload.member))
    .map(response => addGroupMemberSuccess(response.xhr.response))
    .takeUntil(action$.ofType(ADD_GROUP_MEMBER_CANCELLED))
    .catch(error => Rx.Observable.of(addGroupMemberFailure(error.xhr.response)))
    .do(response => {
    // if (response.type == GET_ORG_GROUP_SUCCESS) {
    //     const dataManager = BackendFactory.getInstance().dataManager;
    //     let rooms = response.payload.result as Array<Room>;
    //     Rx.Observable.from(rooms)._do(x => {
    //         dataManager.roomDAL.save(x._id, x);
    //     }).subscribe();
    // }
}));
const EDIT_GROUP_DETAIL = "EDIT_GROUP_DETAIL";
exports.EDIT_GROUP_DETAIL_SUCCESS = "EDIT_GROUP_DETAIL_SUCCESS";
exports.EDIT_GROUP_DETAIL_FAILURE = "EDIT_GROUP_DETAIL_FAILURE";
const EDIT_GROUP_DETAIL_CANCELLED = "EDIT_GROUP_DETAIL_CANCELLED";
exports.editGroupDetail = redux_actions_1.createAction(EDIT_GROUP_DETAIL, (room) => room);
const editGroupDetailSuccess = redux_actions_1.createAction(exports.EDIT_GROUP_DETAIL_SUCCESS, payload => payload);
const editGroupDetailFailure = redux_actions_1.createAction(exports.EDIT_GROUP_DETAIL_FAILURE, error => error);
const editGroupDetailCancelled = redux_actions_1.createAction(EDIT_GROUP_DETAIL_CANCELLED);
exports.editGroupDetail_Epic = action$ => (action$.ofType(EDIT_GROUP_DETAIL).mergeMap(action => ajax({
    method: "POST",
    url: `${config().api.group}/update`,
    body: JSON.stringify({ room: action.payload }),
    headers: {
        "Content-Type": "application/json",
        "x-access-token": configureStore_1.default.getState().authReducer.token
    }
}).map(response => editGroupDetailSuccess(response.xhr.response))
    .takeUntil(action$.ofType(EDIT_GROUP_DETAIL_CANCELLED))
    .catch(error => Rx.Observable.of(editGroupDetailFailure(error.xhr.response)))));
