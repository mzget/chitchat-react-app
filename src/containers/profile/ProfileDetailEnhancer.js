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
const chitchatFactory_1 = require("../../chitchat/chats/chitchatFactory");
const config = () => chitchatFactory_1.ChitChatFactory.getInstance().config;
const ProfileDetail_1 = require("./ProfileDetail");
const userRx = require("../../redux/user/userRx");
const mapStateToProps = (state) => ({
    userReducer: state.userReducer
});
const submit = (props) => {
    let user = __assign({}, props.user);
    props.dispatch(userRx.updateUserInfo(user));
};
const enhance = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.withState("user", "updateUser", ({ user }) => user), recompose_1.withState("imageFile", "setImageFile", null), recompose_1.lifecycle({
    componentWillReceiveProps(nextProps) {
        let { userReducer } = nextProps;
        if (userReducer.state == userRx.UPLOAD_USER_AVATAR_FAILURE) {
            if (!recompose_1.shallowEqual(this.props.userReducer, userReducer)) {
                this.props.alert(userReducer.error);
            }
        }
        else if (userReducer.state == userRx.UPLOAD_USER_AVATAR_SUCCESS) {
            if (!recompose_1.shallowEqual(this.props.userReducer, userReducer)) {
                this.props.setImageFile(prev => null);
                let avatarUrl = `${config().api.host}${userReducer.userAvatarResult.path}`;
                let user = this.props.user;
                user["avatar"] = avatarUrl;
                this.props.updateUser(prev => user, () => { submit(this.props); });
            }
        }
        else if (userReducer.state == userRx.UPDATE_USER_INFO_FAILURE) {
            if (!recompose_1.shallowEqual(this.props.userReducer, userReducer)) {
                this.props.alert(userReducer.error);
            }
        }
        else if (userReducer.state == userRx.UPDATE_USER_INFO_SUCCESS) {
            if (!recompose_1.shallowEqual(this.props.userReducer, userReducer)) {
                this.props.alert(userRx.UPDATE_USER_INFO_SUCCESS);
            }
        }
    }
}), recompose_1.withHandlers({
    onFirstNameChange: (props) => (event, newValue) => {
        let user = props.user;
        user["firstname"] = newValue;
        props.updateUser(prev => user);
    },
    onLastNameChange: (props) => (event, newValue) => {
        let user = props.user;
        user["lastname"] = newValue;
        props.updateUser(prev => user);
    },
    onTelNumberChange: (props) => (event, newValue) => {
        let user = props.user;
        user["tel"] = newValue;
        props.updateUser(prev => user);
    },
    onFileReaderChange: (props) => (event, results) => {
        results.forEach(result => {
            const [progressEvent, file] = result;
            let user = props.user;
            user["avatar"] = progressEvent.target.result;
            props.updateUser(prev => user);
            props.setImageFile(prev => file);
        });
    },
    onSubmit: (props) => () => {
        if (!!props.imageFile) {
            // @Todo upload group image first...
            props.dispatch(userRx.uploadUserAvatar(props.imageFile));
        }
        else {
            submit(props);
        }
    }
}));
exports.ProfileDetailEnhanced = enhance(({ user, teamProfile, onFirstNameChange, onLastNameChange, onTelNumberChange, onSubmit, onFileReaderChange, alert }) => React.createElement(ProfileDetail_1.ProfileDetail, { user: user, teamProfile: teamProfile, onFirstNameChange: onFirstNameChange, onLastNameChange: onLastNameChange, onTelNumberChange: onTelNumberChange, onFileReaderChange: onFileReaderChange, onSubmit: onSubmit }));
