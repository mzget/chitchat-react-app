import * as React from "react";
import { connect } from "react-redux";
import { withProps, withState, withHandlers, compose, lifecycle, shallowEqual } from "recompose";

import config from "../../configs/config";
import { ProfileDetail } from "./ProfileDetail";
import * as userRx from "../../redux/user/userRx";

import { ChitChatAccount } from "../../../server/scripts/models/User";
import { ITeamProfile } from "../../../server/scripts/models/TeamProfile";

interface IEnhanceProps {
    user: ChitChatAccount;
    teamProfile: ITeamProfile;
    updateUser;
    imageFile;
    setImageFile;
    dispatch;
    userReducer;
}

const submit = (props: IEnhanceProps) => {
    console.log(props);

    let user = { ...props.user } as ChitChatAccount;
    // props.dispatch(userRx.(user));
};
const enhance = compose(
    withState("user", "updateUser", ({ user }) => user),
    withState("imageFile", "setImageFile", null),
    lifecycle({
        componentWillReceiveProps(nextProps) {
            let { userReducer } = nextProps;

            if (userReducer.state == userRx.UPLOAD_USER_AVATAR_FAILURE) {
                if (!shallowEqual(this.props.userReducer, userReducer)) {
                    this.props.onError(userReducer.error);
                }
            }
            else if (userReducer.state == userRx.UPLOAD_USER_AVATAR_SUCCESS) {
                if (!shallowEqual(this.props.userReducer, userReducer)) {
                    this.props.setImageFile(prev => null);
                    let avatarUrl = `${config.api.host}${userReducer.userAvatarResult.path}`;

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
    }),
    withHandlers({
        onFirstNameChange: (props: IEnhanceProps) => (event, newValue) => {
            let user = props.user;
            user["firstname"] = newValue;

            props.updateUser(prev => user);
        },
        onLastNameChange: (props: IEnhanceProps) => (event, newValue) => {
            let user = props.user;
            user["lastname"] = newValue;

            props.updateUser(prev => user);
        },
        onTelNumberChange: (props: IEnhanceProps) => (event, newValue) => {
            let user = props.user;
            user["tel"] = newValue;

            props.updateUser(prev => user);
        },
        onFileReaderChange: (props: IEnhanceProps) => (event, results) => {
            results.forEach(result => {
                const [progressEvent, file] = result;

                let user = props.user;
                user["avatar"] = progressEvent.target.result;
                props.updateUser(prev => user);
                // props.setImageUrl(prev => progressEvent.target.result);
                props.setImageFile(prev => file);
            });
        },
        onSubmit: (props: IEnhanceProps) => () => {
            if (!!props.imageFile) {
                // @Todo upload group image first...
                props.dispatch(userRx.uploadUserAvatar(props.imageFile));
            }
            else {
                submit(props);
            }
        }
    })
);
const ProfileDetailEnhancer = enhance(({
  user, teamProfile, onFirstNameChange, onLastNameChange, onTelNumberChange, onSubmit, onFileReaderChange
     }: IEnhanceProps) =>
    <ProfileDetail
        user={user}
        teamProfile={teamProfile}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onTelNumberChange={onTelNumberChange}
        onFileReaderChange={onFileReaderChange}
        onSubmit={onSubmit} />
);

const mapStateToProps = (state) => ({
    userReducer: state.userReducer
});
export const ConnectProfileDetailEnhancer = connect(mapStateToProps)(ProfileDetailEnhancer);