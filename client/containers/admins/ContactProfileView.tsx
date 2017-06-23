import * as React from "react";
import Flexbox from "flexbox-react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { darkWhite, blueGrey50, darkBlack } from "material-ui/styles/colors";
import { RaisedButton, Card, Avatar } from "material-ui";

import { SelectOrgChart } from "../../components/SelectOrgChart";
import { SelectTeamRole } from "../../components/SelectTeamRole";
import { ChitChatAccount } from "../../chitchat/chats/models/User";
import { IOrgChart } from "../../chitchat/chats/models/OrgChart";
import { Button, Row, Col, Panel, ListGroup, ListGroupItem, FormGroup, FormControl, Table, FieldGroup, ControlLabel } from 'react-bootstrap';
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
        <MuiThemeProvider>
            <Flexbox flexDirection="row" width="100%" height="calc(100vh -56px)" style={{ backgroundColor: blueGrey50 }} >
                <Flexbox flexGrow={1} />
                <Flexbox flexDirection="column" minWidth="400"
                    style={{ overflowY: "auto", backgroundColor: darkWhite }} >
                    <Flexbox justifyContent="center" alignItems="center" padding="10px"
                        style={{ backgroundColor: darkBlack }}>
                        {props.member.avatar ? <Avatar src={props.member.avatar} size={100} />
                            : <Avatar src="https://thumb.ibb.co/hnoE5k/userdefault.png" size={100} />
                        }
                    </Flexbox>
                    <div style={{ marginLeft: "2%", marginRight: "2%" }}>
                        <Row style={Styles.generalStyles.marginZero}>
                            <Col md={10} mdOffset={1} style={Styles.generalStyles.paddingZero}>
                                <Panel>
                                    <Row>
                                        <Col md={12}>
                                            <Col xs={12} md={3}>
                                                <strong>Username : </strong>
                                            </Col>
                                            <Col xs={12} md={9}>
                                                <FormGroup style={{ margin: "0" }}>
                                                    <FormControl value={props.member.username} disabled />
                                                </FormGroup>
                                            </Col>
                                        </Col>
                                    </Row>

                                    <Row style={{ paddingTop: "2%" }}>
                                        <Col md={12}>
                                            <Col xs={12} md={3}>
                                                <strong>Name : </strong>
                                            </Col>
                                            <Col xs={12} md={9}>
                                                <FormGroup style={{ margin: "0" }}>
                                                    <FormControl value={props.member.firstname + " " + props.member.lastname} disabled />
                                                </FormGroup>
                                            </Col>
                                        </Col>
                                    </Row>

                                    <Row style={{ paddingTop: "2%" }}>
                                        <Col md={12}>
                                            <Col xs={12} md={3}>
                                                <strong>Email : </strong>
                                            </Col>
                                            <Col xs={12} md={9}>
                                                <FormGroup style={{ margin: "0" }}>
                                                    <FormControl value={props.member.email ? props.member.email : "not set"} disabled />
                                                </FormGroup>
                                            </Col>
                                        </Col>
                                    </Row>

                                    <Row style={{ paddingTop: "2%" }}>
                                        <Col md={12}>
                                            <Col xs={12} md={3}>
                                                <strong>Select Org. Group : </strong>
                                            </Col>
                                            <Col xs={12} md={9}>
                                                <SelectOrgChart dropdownItems={props.orgsRoleItems} dropdownValue={props.orgRoleValue} dropdownChange={props.dropdownChange} />
                                            </Col>
                                        </Col>
                                    </Row>

                                    <Row style={{ paddingTop: "2%" }}>
                                        <Col md={12}>
                                            <Col xs={12} md={3}>
                                                <strong>Select Team Role : </strong>
                                            </Col>
                                            <Col xs={12} md={9}>
                                                <SelectTeamRole teamRoleItems={props.teamRoleItems} teamRoleValue={props.teamRoleValue} onTeamRoleChange={props.onTeamRoleChange} />
                                            </Col>
                                        </Col>
                                    </Row>

                                </Panel>
                            </Col>
                        </Row>
                    </div>
                    <Flexbox flexGrow={1} />
                    <SubmitButton  {...props} />
                </Flexbox>
                <Flexbox flexGrow={1} />
            </Flexbox>
        </MuiThemeProvider>
    );
};