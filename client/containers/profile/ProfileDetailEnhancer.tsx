import * as React from "react";
import { connect } from "react-redux";
import { withProps, withState, withHandlers, compose, lifecycle } from "recompose";

import { ProfileDetail } from "./ProfileDetail";

import { ChitChatAccount } from "../../../server/scripts/models/User";

interface IEnhanceProps {
    user: ChitChatAccount;
    updateUser;
    dispatch;
}
const enhance = compose(
    withState("user", "updateUser", ({ user }) => user),
    // lifecycle({
    //     componentWillMount() {
    //         this.props.updateMembers(member => this.props.initMembers);
    //     }
    // }),
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
        onSubmit: (props: IEnhanceProps) => () => {
            // let payload = { room_id: props.room_id, members: props.members };
            // props.dispatch(editGroupRxActions.editGroupMember(payload));

            console.log("bobo", props);
        }
    })
);
const ProfileDetailEnhancer = enhance(({
  user, onFirstNameChange, onLastNameChange, onSubmit, onFileReaderChange
     }: IEnhanceProps) =>
    <ProfileDetail
        image={user.avatar}
        first_name={user.firstname}
        last_name={user.lastname}
        email={user.email}
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={onLastNameChange}
        onFileReaderChange={onFileReaderChange}
        onSubmit={onSubmit} />
);

export const ConnectProfileDetailEnhancer = connect()(ProfileDetailEnhancer);