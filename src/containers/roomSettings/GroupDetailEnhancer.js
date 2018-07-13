import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withState, withHandlers, compose, lifecycle, shallowEqual } from "recompose";
import { GroupDetail } from "./GroupDetail";
import * as editGroupRxActions from "../../redux/group/editGroupRxActions";
import * as groupRx from "../../redux/group/groupRx";
import { ChitChatFactory } from "../../chitchat/chats/ChitChatFactory";
import * as chatroomActions from "stalk-simplechat/app/redux/chatroom/chatroomActions";
const config = () => ChitChatFactory.getInstance().config;
const submit = (props) => {
    let group = { ...props.group };
    group.name = props.group_name;
    group.description = props.group_description;
    group.image = props.image;
    props.dispatch(editGroupRxActions.editGroupDetail(group));
};
const mapStateToProps = (state) => ({
    groupReducer: state.groupReducer,
    chatroomReducer: state.chatroomReducer
});
const GroupDetailEnhancer = compose(connect(mapStateToProps), withState("group", "setGroup", ({ group }) => group), withState("group_name", "setGroupName", ({ group_name }) => group_name), withState("group_description", "setGroupDescription", ({ group_description }) => group_description), withState("image", "setImageUrl", ({ image }) => image), withState("imageFile", "setImageFile", null), lifecycle({
    componentWillMount() {
        let { params } = this.props.match;
        let room = chatroomActions.getRoom(params.room_id);
        if (room) {
            this.props.setGroup(group => room);
            this.props.setGroupName(name => room.name);
            this.props.setGroupDescription(description => room.description);
            this.props.setImageUrl(url => room.image);
        }
    },
    componentWillReceiveProps(nextProps) {
        let { groupReducer } = nextProps;
        if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_FAILURE) {
            if (!shallowEqual(this.props.groupReducer, groupReducer)) {
                this.props.onError(groupReducer.error);
            }
        }
        else if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_SUCCESS) {
            if (!shallowEqual(this.props.groupReducer, groupReducer)) {
                this.props.setImageFile(prev => null);
                this.props.setImageUrl(prev => `${config().api.host}${groupReducer.groupImageResult.path}`, () => {
                    submit(this.props);
                });
            }
        }
        else if (groupReducer.state == editGroupRxActions.EDIT_GROUP_DETAIL_FAILURE) {
            if (!shallowEqual(this.props.groupReducer, groupReducer)) {
                this.props.onError(groupReducer.error);
            }
        }
        else if (groupReducer.state == editGroupRxActions.EDIT_GROUP_DETAIL_SUCCESS) {
            if (!shallowEqual(this.props.groupReducer.state, groupReducer.state)) {
                this.props.onError(editGroupRxActions.EDIT_GROUP_DETAIL_SUCCESS);
                this.props.onFinished();
            }
        }
    }
}), withHandlers({
    onGroupNameChange: (props) => (e, text) => {
        props.setGroupName(groupName => text);
    }, onGroupDescriptionChange: (props) => (e, text) => {
        props.setGroupDescription(group_description => text);
    },
    onFileReaderChange: (props) => (e, results) => {
        results.forEach(result => {
            const [progressEvent, file] = result;
            props.setImageUrl(prev => progressEvent.target.result);
            props.setImageFile(prev => file);
        });
    },
    onSubmit: (props) => event => {
        if (!!props.imageFile) {
            // @Todo upload group image first...
            props.dispatch(groupRx.uploadGroupImage(props.imageFile));
        }
        else {
            submit(props);
        }
    }
}));
export let GroupDetailEnhanced = GroupDetailEnhancer(({ group, image, group_name, group_description, onGroupNameChange, onGroupDescriptionChange, onFileReaderChange, onSubmit, onError, onFinished, history, match }) => <GroupDetail image={image} group_name={group_name} group_description={group_description} onSubmit={onSubmit} onGroupNameChange={onGroupNameChange} onGroupDescriptionChange={onGroupDescriptionChange} onFileReaderChange={onFileReaderChange}/>);
GroupDetailEnhanced = withRouter(GroupDetailEnhanced);
