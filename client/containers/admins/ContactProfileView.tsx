import * as React from "react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { RaisedButton, TextField, MenuItem, SelectField, Subheader } from "material-ui";

import { SelectOrgChart } from "../../components/SelectOrgChart";
import { SelectTeamRole } from "../../components/SelectTeamRole";
import { ChitChatAccount } from "../../chitchat/chats/models/User";
import { IOrgChart } from "../../chitchat/chats/models/OrgChart";

interface IComponentProps {
    member: ChitChatAccount;
    onSubmit: () => void;
    dropdownItems: Array<IOrgChart>;
    dropdownValue: number;
    dropdownChange: (event, id, value) => void;
    teamRoleItems: Array<string>;
    teamRoleValue: number;
    onTeamRoleChange: (event, id, value) => void;
}


const SubmitButton = (props: IComponentProps) => (
    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} ></RaisedButton>
);

export const ContactProfileView = (props: IComponentProps) => {
    return (
        <MuiThemeProvider>
            <div>
                <Subheader>Profile</Subheader>
                <p>{props.member.username}</p>
                <p>{props.member.firstname}</p>
                <p>{props.member.lastname}</p>
                <p>{props.member.email}</p>
                <SelectOrgChart dropdownItems={props.dropdownItems} dropdownValue={props.dropdownValue} dropdownChange={props.dropdownChange} />
                <SelectTeamRole teamRoleItems={props.teamRoleItems} teamRoleValue={props.teamRoleValue} onTeamRoleChange={props.onTeamRoleChange} />
                <SubmitButton {...props} />
            </div>
        </MuiThemeProvider>
    );
};