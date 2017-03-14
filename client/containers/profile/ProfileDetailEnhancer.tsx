import * as React from "react";
import { connect } from "react-redux";
import { withProps, withState, withHandlers, compose, lifecycle } from "recompose";

import { ProfileDetail } from "./ProfileDetail";
import { } from "../../redux/user/userRx";

import { ChitChatAccount } from "../../../server/scripts/models/User";
import { ITeamProfile } from "../../../server/scripts/models/TeamProfile";

interface IEnhanceProps {
    user: ChitChatAccount;
    teamProfile: ITeamProfile;
    updateUser;
    setImageFile;
    dispatch;
}
const enhance = compose(
    withState("user", "updateUser", ({ user }) => user),
    withState("imageFile", "setImageFile", null),
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
            // props.dispatch(editGroupRxActions.editGroupMember(payload));

            console.log("bobo", props);
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
export const ConnectProfileDetailEnhancer = connect()(ProfileDetailEnhancer);