import * as React from "react";
import { connect } from "react-redux";
import { withProps, withState, withHandlers, compose, lifecycle } from "recompose";

import { ProfileDetail } from "./ProfileDetail";
import { } from "../../redux/user/userRx";

import { ChitChatAccount } from "../../../server/scripts/models/User";

interface IEnhanceProps {
    user: ChitChatAccount;
    updateUser;
    dispatch;
}
const enhance = compose(
    withState("user", "updateUser", ({ user }) => user),
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
        onSubmit: (props: IEnhanceProps) => () => {
            // props.dispatch(editGroupRxActions.editGroupMember(payload));

            console.log("bobo", props);
        }
    })
);
const ProfileDetailEnhancer = enhance(({
  user, onFirstNameChange, onLastNameChange, onTelNumberChange, onSubmit, onFileReaderChange
     }: IEnhanceProps) =>
    <ProfileDetail
        user={user}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onTelNumberChange={onTelNumberChange}
        onFileReaderChange={onFileReaderChange}
        onSubmit={onSubmit} />
);
export const ConnectProfileDetailEnhancer = connect()(ProfileDetailEnhancer);