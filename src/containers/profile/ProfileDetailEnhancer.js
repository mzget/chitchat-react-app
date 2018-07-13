import * as React from "react";
import { connect } from "react-redux";
import { withState, withHandlers, compose, lifecycle, shallowEqual } from "recompose";
import { ProfileDetail } from "./ProfileDetail";
import * as userRx from "../../redux/user/userRx";
import InternalStore from "stalk-simplechat";
const apiConfig = () => InternalStore.getApiConfig();
const mapStateToProps = (state) => ({
    userReducer: state.userReducer,
    alertReducer: state.alertReducer,
});
const submit = (props) => {
    const user = { ...props.user };
    props.dispatch(userRx.updateUserInfo(user));
};
const ProfileDetailEnhancer = compose(connect(mapStateToProps), withState("user", "updateUser", ({ user }) => user), withState("imageFile", "setImageFile", null), lifecycle({
    componentWillReceiveProps(nextProps) {
        const { userReducer, alertReducer } = nextProps;
        if (userReducer.state === userRx.UPLOAD_USER_AVATAR_SUCCESS) {
            if (!shallowEqual(this.props.userReducer, userReducer)) {
                this.props.setImageFile((prev) => null);
                const avatarUrl = `${apiConfig().host}${userReducer.userAvatarResult.path}`;
                const user = this.props.user;
                user.avatar = avatarUrl;
                this.props.updateUser((prev) => user, () => { submit(this.props); });
            }
        }
        else if (userReducer.state === userRx.UPDATE_USER_INFO_SUCCESS) {
            if (!shallowEqual(this.props.userReducer.state, userReducer.state)) {
                this.props.alert(userRx.UPDATE_USER_INFO_SUCCESS);
            }
        }
        if (!!alertReducer.error) {
            this.props.alert(alertReducer.error);
        }
    },
}), withHandlers({
    onUserNameChange: (props) => (event, newValue) => {
        const user = props.user;
        user.username = newValue;
        props.updateUser((prev) => user);
    },
    onFirstNameChange: (props) => (event, newValue) => {
        const user = props.user;
        user.firstname = newValue;
        props.updateUser((prev) => user);
    },
    onLastNameChange: (props) => (event, newValue) => {
        const user = props.user;
        user.lastname = newValue;
        props.updateUser((prev) => user);
    },
    onTelNumberChange: (props) => (event, newValue) => {
        const user = props.user;
        user.tel = newValue;
        props.updateUser((prev) => user);
    },
    onFileReaderChange: (props) => (event, results) => {
        results.forEach((result) => {
            const [progressEvent, file] = result;
            const user = props.user;
            user.avatar = progressEvent.target.result;
            props.updateUser((prev) => user);
            props.setImageFile((prev) => file);
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
    },
}));
export const ProfileDetailEnhanced = ProfileDetailEnhancer(({ user, teamProfile, alert, onUserNameChange, onFirstNameChange, onLastNameChange, onTelNumberChange, onSubmit, onFileReaderChange }) => <ProfileDetail user={user} teamProfile={teamProfile} onUserNameChange={onUserNameChange} onFirstNameChange={onFirstNameChange} onLastNameChange={onLastNameChange} onTelNumberChange={onTelNumberChange} onFileReaderChange={onFileReaderChange} onSubmit={onSubmit}/>);
