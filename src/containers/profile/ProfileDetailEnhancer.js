"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var React = require("react");
var react_redux_1 = require("react-redux");
var recompose_1 = require("recompose");
var ProfileDetail_1 = require("./ProfileDetail");
var userRx = require("../../redux/user/userRx");
var ChitchatFactory_1 = require("../../chitchat/chats/ChitchatFactory");
var config = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var mapStateToProps = function (state) { return ({
    userReducer: state.userReducer,
    alertReducer: state.alertReducer
}); };
var submit = function (props) {
    var user = __assign({}, props.user);
    props.dispatch(userRx.updateUserInfo(user));
};
var ProfileDetailEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.withState("user", "updateUser", function (_a) {
    var user = _a.user;
    return user;
}), recompose_1.withState("imageFile", "setImageFile", null), recompose_1.lifecycle({
    componentWillReceiveProps: function (nextProps) {
        var _this = this;
        var userReducer = nextProps.userReducer, alertReducer = nextProps.alertReducer;
        if (userReducer.state == userRx.UPLOAD_USER_AVATAR_SUCCESS) {
            if (!recompose_1.shallowEqual(this.props.userReducer, userReducer)) {
                this.props.setImageFile(function (prev) { return null; });
                var avatarUrl = "" + config().api.host + userReducer.userAvatarResult.path;
                var user_1 = this.props.user;
                user_1["avatar"] = avatarUrl;
                this.props.updateUser(function (prev) { return user_1; }, function () { submit(_this.props); });
            }
        }
        else if (userReducer.state == userRx.UPDATE_USER_INFO_SUCCESS) {
            if (!recompose_1.shallowEqual(this.props.userReducer.state, userReducer.state)) {
                this.props.alert(userRx.UPDATE_USER_INFO_SUCCESS);
            }
        }
        if (!!alertReducer.error) {
            this.props.alert(alertReducer.error);
        }
    }
}), recompose_1.withHandlers({
    onFirstNameChange: function (props) { return function (event, newValue) {
        var user = props.user;
        user["firstname"] = newValue;
        props.updateUser(function (prev) { return user; });
    }; },
    onLastNameChange: function (props) { return function (event, newValue) {
        var user = props.user;
        user["lastname"] = newValue;
        props.updateUser(function (prev) { return user; });
    }; },
    onTelNumberChange: function (props) { return function (event, newValue) {
        var user = props.user;
        user["tel"] = newValue;
        props.updateUser(function (prev) { return user; });
    }; },
    onFileReaderChange: function (props) { return function (event, results) {
        results.forEach(function (result) {
            var progressEvent = result[0], file = result[1];
            var user = props.user;
            user["avatar"] = progressEvent.target.result;
            props.updateUser(function (prev) { return user; });
            props.setImageFile(function (prev) { return file; });
        });
    }; },
    onSubmit: function (props) { return function () {
        if (!!props.imageFile) {
            // @Todo upload group image first...
            props.dispatch(userRx.uploadUserAvatar(props.imageFile));
        }
        else {
            submit(props);
        }
    }; }
}));
exports.ProfileDetailEnhanced = ProfileDetailEnhancer(function (_a) {
    var user = _a.user, teamProfile = _a.teamProfile, alert = _a.alert, onFirstNameChange = _a.onFirstNameChange, onLastNameChange = _a.onLastNameChange, onTelNumberChange = _a.onTelNumberChange, onSubmit = _a.onSubmit, onFileReaderChange = _a.onFileReaderChange;
    return React.createElement(ProfileDetail_1.ProfileDetail, { user: user, teamProfile: teamProfile, onFirstNameChange: onFirstNameChange, onLastNameChange: onLastNameChange, onTelNumberChange: onTelNumberChange, onFileReaderChange: onFileReaderChange, onSubmit: onSubmit });
});
