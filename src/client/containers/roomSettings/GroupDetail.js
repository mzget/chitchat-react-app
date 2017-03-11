"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Colors = require("material-ui/styles/colors");
const material_ui_1 = require("material-ui");
const Avatar_1 = require("material-ui/Avatar");
const FileReaderInput = require("react-file-reader-input");
const config_1 = require("../../configs/config");
const editGroupRxActions = require("../../redux/group/editGroupRxActions");
const groupRx = require("../../redux/group/groupRx");
const styles = {
    span: {
        padding: 8
    },
    avatar: {
        margin: 5
    }
};
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
const GroupDetail = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true, align: "center" },
        React.createElement(reflexbox_1.Box, { justify: "center", align: "center", p: 2 },
            React.createElement("h3", null, "Edit Group"),
            React.createElement("p", null, "Enter group informations")),
        React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: (props.onFileReaderChange) ? props.onFileReaderChange : () => { }, disabled: props.disabledImage },
            React.createElement(Avatar_1.default, { src: props.image, size: 96, style: styles.avatar })),
        React.createElement(material_ui_1.TextField, { hintText: "group name", errorText: "This field is required", value: props.group_name, onChange: props.onGroupNameChange, onKeyDown: (e) => {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(material_ui_1.TextField, { hintText: "group description", value: props.group_description, onChange: props.onGroupDescriptionChange, onKeyDown: (e) => {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }))));
const EnhanceGroupDetail = enhance(({ group, image, group_name, group_description, onGroupNameChange, onGroupDescriptionChange, onFileReaderChange, onSubmit, onError, onFinished }) => React.createElement(GroupDetail, { image: image, group_name: group_name, group_description: group_description, onSubmit: onSubmit, onGroupNameChange: onGroupNameChange, onGroupDescriptionChange: onGroupDescriptionChange, onFileReaderChange: onFileReaderChange }));
const mapStateToProps = (state) => ({ groupReducer: state.groupReducer });
exports.ConnectGroupDetail = react_redux_1.connect(mapStateToProps)(EnhanceGroupDetail);
