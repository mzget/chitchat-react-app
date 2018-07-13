import * as React from "react";
import { connect } from "react-redux";
import { withState, withHandlers, compose, lifecycle, shallowEqual } from "recompose";

import { ProfileDetail } from "./ProfileDetail";
import * as userRx from "../../redux/user/userRx";

import { ChitChatAccount } from "../../chitchat/chats/models/User";
import { ITeamProfile } from "../../chitchat/chats/models/TeamProfile";
import InternalStore from "stalk-simplechat";
import { IComponentProps } from "../../utils/IComponentProps";

const apiConfig = () => InternalStore.getApiConfig();

interface IEnhanceProps {
    user: ChitChatAccount;
    teamProfile: ITeamProfile;
    updateUser;
    imageFile;
    setImageFile;
    alert: (message) => void;
    dispatch;
    userReducer;
}

const mapStateToProps = (state) => ({
    userReducer: state.userReducer,
    alertReducer: state.alertReducer,
});

const submit = (props: IEnhanceProps) => {
    const user = { ...props.user } as ChitChatAccount;
    props.dispatch(userRx.updateUserInfo(user));
};
const ProfileDetailEnhancer = compose(
    connect(mapStateToProps),
    withState("user", "updateUser", ({ user }) => user),
    withState("imageFile", "setImageFile", null),
    lifecycle({
        componentWillReceiveProps(nextProps: IComponentProps) {
            const { userReducer, alertReducer } = nextProps;

            if (userReducer.state === userRx.UPLOAD_USER_AVATAR_SUCCESS) {
                if (!shallowEqual(this.props.userReducer, userReducer)) {
                    this.props.setImageFile((prev) => null);
                    const avatarUrl = `${apiConfig().host}${userReducer.userAvatarResult.path}`;

                    const user = this.props.user;
                    user.avatar = avatarUrl;
                    this.props.updateUser((prev) => user, () => { submit(this.props); });
                }
            } else if (userReducer.state === userRx.UPDATE_USER_INFO_SUCCESS) {
                if (!shallowEqual(this.props.userReducer.state, userReducer.state)) {
                    this.props.alert(userRx.UPDATE_USER_INFO_SUCCESS);
                }
            }

            if (!!alertReducer.error) {
                this.props.alert(alertReducer.error);
            }
        },
    }),
    withHandlers({
        onUserNameChange: (props: IEnhanceProps) => (event, newValue) => {
            const user = props.user;
            user.username = newValue;

            props.updateUser((prev) => user);
        },
        onFirstNameChange: (props: IEnhanceProps) => (event, newValue) => {
            const user = props.user;
            user.firstname = newValue;

            props.updateUser((prev) => user);
        },
        onLastNameChange: (props: IEnhanceProps) => (event, newValue) => {
            const user = props.user;
            user.lastname = newValue;

            props.updateUser((prev) => user);
        },
        onTelNumberChange: (props: IEnhanceProps) => (event, newValue) => {
            const user = props.user;
            user.tel = newValue;

            props.updateUser((prev) => user);
        },
        onFileReaderChange: (props: IEnhanceProps) => (event, results) => {
            results.forEach((result) => {
                const [progressEvent, file] = result;

                const user = props.user;
                user.avatar = progressEvent.target.result;
                props.updateUser((prev) => user);
                props.setImageFile((prev) => file);
            });
        },
        onSubmit: (props: IEnhanceProps) => () => {
            if (!!props.imageFile) {
                // @Todo upload group image first...
                props.dispatch(userRx.uploadUserAvatar(props.imageFile));
            } else {
                submit(props);
            }
        },
    }),
);

export const ProfileDetailEnhanced = ProfileDetailEnhancer(({
    user, teamProfile, alert,
    onUserNameChange, onFirstNameChange, onLastNameChange, onTelNumberChange, onSubmit, onFileReaderChange }: any) =>
    <ProfileDetail
        user={user}
        teamProfile={teamProfile}
        onUserNameChange={onUserNameChange}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onTelNumberChange={onTelNumberChange}
        onFileReaderChange={onFileReaderChange}
        onSubmit={onSubmit} />,
) as React.ComponentClass<{ user, teamProfile, alert }>;
