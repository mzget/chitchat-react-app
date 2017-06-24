import { connect } from "react-redux";
import { withState, withHandlers, compose } from "recompose";
import * as editGroupRxActions from "../../redux/group/editGroupRxActions";
export const EditGroupMemberEnhancer = compose(connect(), withState("value", "setValue", "0"), withHandlers({
    removeItem: (props) => (item) => {
        props.dispatch(editGroupRxActions.removeGroupMember(props.room_id, item._id));
    }
}));
