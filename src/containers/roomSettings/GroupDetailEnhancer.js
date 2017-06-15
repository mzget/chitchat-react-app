"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var recompose_1 = require("recompose");
var GroupDetail_1 = require("./GroupDetail");
var editGroupRxActions = require("../../redux/group/editGroupRxActions");
var groupRx = require("../../redux/group/groupRx");
var ChitchatFactory_1 = require("../../chitchat/chats/ChitchatFactory");
var chatroomActions = require("../../chitchat/chats/redux/chatroom/chatroomActions");
var config = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var submit = function (props) {
    var group = __assign({}, props.group);
    group.name = props.group_name;
    group.description = props.group_description;
    group.image = props.image;
    props.dispatch(editGroupRxActions.editGroupDetail(group));
};
var mapStateToProps = function (state) { return ({
    groupReducer: state.groupReducer,
    chatroomReducer: state.chatroomReducer
}); };
var GroupDetailEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.withState("group", "setGroup", function (_a) {
    var group = _a.group;
    return group;
}), recompose_1.withState("group_name", "setGroupName", function (_a) {
    var group_name = _a.group_name;
    return group_name;
}), recompose_1.withState("group_description", "setGroupDescription", function (_a) {
    var group_description = _a.group_description;
    return group_description;
}), recompose_1.withState("image", "setImageUrl", function (_a) {
    var image = _a.image;
    return image;
}), recompose_1.withState("imageFile", "setImageFile", null), recompose_1.lifecycle({
    componentWillMount: function () {
        var params = this.props.match.params;
        var room = chatroomActions.getRoom(params.room_id);
        if (room) {
            this.props.setGroup(function (group) { return room; });
            this.props.setGroupName(function (name) { return room.name; });
            this.props.setGroupDescription(function (description) { return room.description; });
            this.props.setImageUrl(function (url) { return room.image; });
        }
    },
    componentWillReceiveProps: function (nextProps) {
        var _this = this;
        var groupReducer = nextProps.groupReducer;
        if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_FAILURE) {
            if (!recompose_1.shallowEqual(this.props.groupReducer, groupReducer)) {
                this.props.onError(groupReducer.error);
            }
        }
        else if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_SUCCESS) {
            if (!recompose_1.shallowEqual(this.props.groupReducer, groupReducer)) {
                this.props.setImageFile(function (prev) { return null; });
                this.props.setImageUrl(function (prev) { return "" + config().api.host + groupReducer.groupImageResult.path; }, function () {
                    submit(_this.props);
                });
            }
        }
        else if (groupReducer.state == editGroupRxActions.EDIT_GROUP_DETAIL_FAILURE) {
            if (!recompose_1.shallowEqual(this.props.groupReducer, groupReducer)) {
                this.props.onError(groupReducer.error);
            }
        }
        else if (groupReducer.state == editGroupRxActions.EDIT_GROUP_DETAIL_SUCCESS) {
            if (!recompose_1.shallowEqual(this.props.groupReducer.state, groupReducer.state)) {
                this.props.onError(editGroupRxActions.EDIT_GROUP_DETAIL_SUCCESS);
                this.props.onFinished();
            }
        }
    }
}), recompose_1.withHandlers({
    onGroupNameChange: function (props) { return function (e, text) {
        props.setGroupName(function (groupName) { return text; });
    }; }, onGroupDescriptionChange: function (props) { return function (e, text) {
        props.setGroupDescription(function (group_description) { return text; });
    }; },
    onFileReaderChange: function (props) { return function (e, results) {
        results.forEach(function (result) {
            var progressEvent = result[0], file = result[1];
            props.setImageUrl(function (prev) { return progressEvent.target.result; });
            props.setImageFile(function (prev) { return file; });
        });
    }; },
    onSubmit: function (props) { return function (event) {
        if (!!props.imageFile) {
            // @Todo upload group image first...
            props.dispatch(groupRx.uploadGroupImage(props.imageFile));
        }
        else {
            submit(props);
        }
    }; }
}));
exports.GroupDetailEnhanced = GroupDetailEnhancer(function (_a) {
    var group = _a.group, image = _a.image, group_name = _a.group_name, group_description = _a.group_description, onGroupNameChange = _a.onGroupNameChange, onGroupDescriptionChange = _a.onGroupDescriptionChange, onFileReaderChange = _a.onFileReaderChange, onSubmit = _a.onSubmit, onError = _a.onError, onFinished = _a.onFinished, history = _a.history, match = _a.match;
    return React.createElement(GroupDetail_1.GroupDetail, { image: image, group_name: group_name, group_description: group_description, onSubmit: onSubmit, onGroupNameChange: onGroupNameChange, onGroupDescriptionChange: onGroupDescriptionChange, onFileReaderChange: onFileReaderChange });
});
exports.GroupDetailEnhanced = react_router_dom_1.withRouter(exports.GroupDetailEnhanced);
