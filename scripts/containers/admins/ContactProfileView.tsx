import * as React from "react";
import Flexbox from "flexbox-react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { darkWhite, blueGrey50, blueGrey100, grey100, indigo50, darkBlack } from "material-ui/styles/colors";
import { RaisedButton, Card, Avatar, Paper } from "material-ui";
import TextField from 'material-ui/TextField';

import { SelectOrgChart } from "../../components/SelectOrgChart";
import { SelectTeamRole } from "../../components/SelectTeamRole";
import { ChitChatAccount } from "../../chitchat/chats/models/User";
import { IOrgChart } from "../../chitchat/chats/models/OrgChart";
const Styles = require("../../styles/generalStyles");
const Profile = require("../../styles/profile");
const BoxShadow = Profile.Styles.boxShadow;
const ProfileBox = Profile.Styles.profileBox;
const DropdownBox = Profile.Styles.dropdownBox;
const MarginTopBottom = Styles.generalStyles.marginTopBottom;
const ManageUserBox = Profile.Styles.manageUserBox;

interface IComponentProps {
    member: ChitChatAccount;
    onSubmit: () => void;
    canSubmit: boolean;
    orgsRoleItems: Array<IOrgChart>;
    orgRoleValue: number;
    dropdownChange: (event, id, value) => void;
    teamRoleItems: Array<string>;
    teamRoleValue: number;
    onTeamRoleChange: (event, id, value) => void;
}


const SubmitButton = (props: IComponentProps) => (
    <div style={{ width: "100%", padding: 5 }}>
        <RaisedButton
            primary={true}
            label="submit"
            fullWidth={true}
            onClick={props.onSubmit}
            disabled={!props.canSubmit}></RaisedButton>
    </div>
);
const DeleteButton = (props: IComponentProps) => (
    <RaisedButton label="delete" backgroundColor="red" labelColor="white" fullWidth></RaisedButton>
);

export const ContactProfileView = (props: IComponentProps) => {
    return (
        <Flexbox flexDirection="row" height="calc(100vh -56px)" style={{ backgroundColor: darkWhite, width: "100%" }} >
            <Flexbox flexGrow={1} />
            <Flexbox flexDirection="column" minWidth="400px" style={{ overflowY: "auto", overflowX: "hidden", backgroundColor: grey100 }} >
                <Flexbox justifyContent="center" alignItems="center" padding="10px" style={{ backgroundColor: darkBlack }}>
                    {props.member.avatar
                        ? <Avatar src={props.member.avatar} size={100} />
                        : <Avatar src="https://thumb.ibb.co/hnoE5k/userdefault.png" size={100} />
                    }
                </Flexbox>
                <div style={{ marginLeft: "2%", marginRight: "2%" }}>
                    <Paper style={{ width: "100%" }} zDepth={1}>
                        <Flexbox flexDirection={"row"} style={{ margin: "2%" }}>
                            <strong>Username : </strong>
                            <Flexbox flexGrow={1} />
                            <TextField value={props.member.username} disabled />
                        </Flexbox>

                        <Flexbox flexDirection={"row"} style={{ margin: "2%" }}>
                            <strong>Name : </strong>
                            <Flexbox flexGrow={1} />
                            <TextField value={props.member.firstname + " " + props.member.lastname} disabled />
                        </Flexbox>

                        <Flexbox flexDirection={"row"} style={{ margin: "2%" }}>
                            <strong>Email : </strong>
                            <Flexbox flexGrow={1} />
                            <TextField value={props.member.email ? props.member.email : "not set"} disabled />
                        </Flexbox>

                        <Flexbox flexDirection={"row"} style={{ margin: "2%" }}>
                            <strong>Select Org. Group : </strong>
                            <Flexbox flexGrow={1} />
                            <SelectOrgChart dropdownItems={props.orgsRoleItems} dropdownValue={props.orgRoleValue} dropdownChange={props.dropdownChange} />
                        </Flexbox>

                        <Flexbox flexDirection={"row"} style={{ margin: "2%" }}>
                            <strong>Select Team Role : </strong>
                            <Flexbox flexGrow={1} />
                            <SelectTeamRole teamRoleItems={props.teamRoleItems} teamRoleValue={props.teamRoleValue} onTeamRoleChange={props.onTeamRoleChange} />
                        </Flexbox>
                    </Paper>
                </div>
                <Flexbox flexGrow={1} />
                <SubmitButton  {...props} />
            </Flexbox>
            <Flexbox flexGrow={1} />
        </Flexbox >
    );
};