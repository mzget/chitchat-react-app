"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const GroupDetail_1 = require("./GroupDetail");
const React = require("react");
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const config_1 = require("../../configs/config");
const editGroupRxActions = require("../../redux/group/editGroupRxActions");
const groupRx = require("../../redux/group/groupRx");
const submit = (props) => {
    console.log(props);
    let group = __assign({}, props.group);
    group.name = props.group_name;
    group.description = props.group_description;
    group.image = props.image;
    props.dispatch(editGroupRxActions.editGroupDetail(group));
};
const enhance = recompose_1.compose(recompose_1.withState("group_name", "setGroupName", ({ group_name }) => group_name), recompose_1.withState("group_description", "setGroupDescription", ({ group_description }) => group_description), recompose_1.withState("image", "setImageUrl", ({ image }) => image), recompose_1.withState("imageFile", "setImageFile", null), recompose_1.lifecycle({
    componentWillReceiveProps(nextProps) {
        let { groupReducer } = nextProps;
        if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_FAILURE) {
            if (!recompose_1.shallowEqual(this.props.groupReducer, groupReducer)) {
                this.props.onError(groupReducer.error);
            }
        }
        else if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_SUCCESS) {
            if (!recompose_1.shallowEqual(this.props.groupReducer, groupReducer)) {
                this.props.setImageFile(prev => null);
                this.props.setImageUrl(prev => `${config_1.default.api.host}${groupReducer.groupImageResult.path}`, () => {
                    submit(this.props);
                });
            }
        }
        else if (groupReducer.state == editGroupRxActions.EDIT_GROUP_DETAIL_FAILURE) {
            if (!recompose_1.shallowEqual(this.props.groupReducer, groupReducer)) {
                this.props.onError(groupReducer.error);
            }
        }
        else if (groupReducer.state == editGroupRxActions.EDIT_GROUP_DETAIL_SUCCESS) {
            if (!recompose_1.shallowEqual(this.props.groupReducer, groupReducer)) {
                this.props.onFinished();
            }
        }
    }
}), recompose_1.withHandlers({
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
const EnhanceGroupDetail = enhance(({ group, image, group_name, group_description, onGroupNameChange, onGroupDescriptionChange, onFileReaderChange, onSubmit, onError, onFinished }) => React.createElement(GroupDetail_1.GroupDetail, { image: image, group_name: group_name, group_description: group_description, onSubmit: onSubmit, onGroupNameChange: onGroupNameChange, onGroupDescriptionChange: onGroupDescriptionChange, onFileReaderChange: onFileReaderChange }));
const mapStateToProps = (state) => ({ groupReducer: state.groupReducer });
exports.ConnectGroupDetail = react_redux_1.connect(mapStateToProps)(EnhanceGroupDetail);
