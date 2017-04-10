import { Record } from "immutable";

import * as groupRx from "./groupRx";
import * as privateGroupRxActions from "./privateGroupRxActions";
import * as editGroupRxActions from "./editGroupRxActions";

import { Room, RoomType } from "../../chitchat/libs/shared/Room";


export const GroupInitState = Record({
    isFetching: false,
    state: null,
    error: null,
    orgGroups: null,
    privateGroups: null,
    groupImageResult: null
});
export const groupReducer = (state = new GroupInitState(), action) => {
    switch (action.type) {
        case groupRx.GET_ORG_GROUP_SUCCESS: {
            return state.set("orgGroups", action.payload.result);
        }
        case groupRx.CREATE_ORG_GROUP_SUCCESS: {
            let group = action.payload as Array<Room>;
            if (group && group.length > 0) {
                if (group[0].type == RoomType.organizationGroup) {
                    let prev = state.get("orgGroups") as Array<Room>;
                    let _next = prev.concat(group);

                    return state.set("orgGroups", _next)
                        .set("state", groupRx.CREATE_ORG_GROUP_SUCCESS);
                }
                else return state;
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
            let group = action.payload as Array<Room>;
            if (group && group.length > 0) {
                if (group[0].type == RoomType.privateGroup) {
                    let prev = state.get("privateGroups") as Array<Room>;
                    let _next = prev.concat(group);

                    return state.set("privateGroups", _next)
                        .set("state", privateGroupRxActions.CREATE_PRIVATE_GROUP_SUCCESS);
                }
                else return state;
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