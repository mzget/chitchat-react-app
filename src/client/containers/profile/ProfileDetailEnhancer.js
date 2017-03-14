"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const config_1 = require("../../configs/config");
const ProfileDetail_1 = require("./ProfileDetail");
const userRx = require("../../redux/user/userRx");
const submit = (props) => {
    console.log(props);
    let user = Object.assign({}, props.user);
    // props.dispatch(userRx.(user));
};
const enhance = recompose_1.compose(recompose_1.withState("user", "updateUser", ({ user }) => user), recompose_1.withState("imageFile", "setImageFile", null), recompose_1.lifecycle({
    componentWillReceiveProps(nextProps) {
        let { userReducer } = nextProps;
        if (userReducer.state == userRx.UPLOAD_USER_AVATAR_FAILURE) {
            if (!recompose_1.shallowEqual(this.props.userReducer, userReducer)) {
                this.props.onError(userReducer.error);
            }
        }
        else if (userReducer.state == userRx.UPLOAD_USER_AVATAR_SUCCESS) {
            if (!recompose_1.shallowEqual(this.props.userReducer, userReducer)) {
                this.props.setImageFile(prev => null);
                let avatarUrl = `${config_1.default.api.host}${userReducer.userAvatarResult.path}`;
                let user = this.props.user;
                user["avatar"] = avatarUrl;
                this.props.updateUser(prev => user, () => { submit(this.props); });
            }
        }
        // else if (groupReducer.state == editGroupRxActions.EDIT_GROUP_DETAIL_FAILURE) {
        //     if (!shallowEqual(this.props.groupReducer, groupReducer)) {
        //         this.props.onError(groupReducer.error);
        //     }
        // }
        // else if (groupReducer.state == editGroupRxActions.EDIT_GROUP_DETAIL_SUCCESS) {
        //     if (!shallowEqual(this.props.groupReducer, groupReducer)) {
        //         this.props.onFinished();
        //     }
        // }
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
            // props.setImageUrl(prev => progressEvent.target.result);
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
const ProfileDetailEnhancer = enhance(({ user, teamProfile, onFirstNameChange, onLastNameChange, onTelNumberChange, onSubmit, onFileReaderChange }) => React.createElement(ProfileDetail_1.ProfileDetail, { user: user, teamProfile: teamProfile, onFirstNameChange: onFirstNameChange, onLastNameChange: onLastNameChange, onTelNumberChange: onTelNumberChange, onFileReaderChange: onFileReaderChange, onSubmit: onSubmit }));
const mapStateToProps = (state) => ({
    userReducer: state.userReducer
});
exports.ConnectProfileDetailEnhancer = react_redux_1.connect(mapStateToProps)(ProfileDetailEnhancer);
