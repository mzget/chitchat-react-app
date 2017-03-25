"use strict";
const immutable_1 = require("immutable");
const groupRx = require("./groupRx");
const privateGroupRxActions = require("./privateGroupRxActions");
const editGroupRxActions = require("./editGroupRxActions");
const Room_1 = require("../../../shared/models/Room");
exports.GroupInitState = immutable_1.Record({
    isFetching: false,
    state: null,
    error: null,
    orgGroups: null,
    privateGroups: null,
    groupImageResult: null
});
exports.groupReducer = (state = new exports.GroupInitState(), action) => {
    switch (action.type) {
        case groupRx.GET_ORG_GROUP_SUCCESS: {
            return state.set("orgGroups", action.payload.result);
        }
        case groupRx.CREATE_ORG_GROUP_SUCCESS: {
            let group = action.payload;
            if (group && group.length > 0) {
                if (group[0].type == Room_1.RoomType.organizationGroup) {
                    let prev = state.get("orgGroups");
                    let _next = prev.concat(group);
                    return state.set("orgGroups", _next)
                        .set("state", groupRx.CREATE_ORG_GROUP_SUCCESS);
                }
                else
                    return state;
            }
            return state;
        }
        case groupRx.CREATE_ORG_GROUP_FAILURE: {
            return state.set("state", groupRx.CREATE_ORG_GROUP_FAILURE)
                .set("error", action.payload.message);
        }
        case privateGroupRxActions.GET_PRIVATE_GROUP_SUCCESS: {
            return state.set("privateGroups", action.payload.result);
        }
        case privateGroupRxActions.CREATE_PRIVATE_GROUP_SUCCESS: {
            let group = action.payload;
            if (group && group.length > 0) {
                if (group[0].type == Room_1.RoomType.privateGroup) {
                    let prev = state.get("privateGroups");
                    let _next = prev.concat(group);
                    return state.set("privateGroups", _next)
                        .set("state", privateGroupRxActions.CREATE_PRIVATE_GROUP_SUCCESS);
                }
                else
                    return state;
            }
            return state;
        }
        case privateGroupRxActions.CREATE_PRIVATE_GROUP_FAILURE: {
            return state.set("state", privateGroupRxActions.CREATE_PRIVATE_GROUP_FAILURE)
                .set("error", action.payload.message);
        }
        case groupRx.UPLOAD_GROUP_IMAGE_SUCCESS: {
            return state.set("state", groupRx.UPLOAD_GROUP_IMAGE_SUCCESS)
                .set("groupImageResult", action.payload.result);
        }
        case groupRx.UPLOAD_GROUP_IMAGE_FAILURE: {
            return state.set("state", groupRx.UPLOAD_GROUP_IMAGE_FAILURE)
                .set("error", action.payload.message);
        }
        case editGroupRxActions.EDIT_GROUP_DETAIL_SUCCESS: {
            return state.set("state", editGroupRxActions.EDIT_GROUP_DETAIL_SUCCESS);
        }
        case editGroupRxActions.EDIT_GROUP_DETAIL_FAILURE: {
            return state.set("state", editGroupRxActions.EDIT_GROUP_DETAIL_FAILURE)
                .set("error", action.payload.message);
        }
        case groupRx.GROUP_RX_EMPTY_STATE: {
            return state.set("state", groupRx.GROUP_RX_EMPTY_STATE).set("error", null);
        }
        default:
            return state;
    }
};
