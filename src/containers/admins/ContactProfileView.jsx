import * as React from "react";
import Flexbox from "flexbox-react";
import { darkWhite, grey100, darkBlack } from "material-ui/styles/colors";
import { RaisedButton, Avatar, Paper } from "material-ui";
import { SelectOrgChart } from "../../components/SelectOrgChart";
import { SelectTeamRole } from "../../components/SelectTeamRole";
import { Col, FormGroup, FormControl } from 'react-bootstrap';
const Styles = require("../../styles/generalStyles");
const Profile = require("../../styles/profile");
const BoxShadow = Profile.Styles.boxShadow;
const ProfileBox = Profile.Styles.profileBox;
const DropdownBox = Profile.Styles.dropdownBox;
const MarginTopBottom = Styles.generalStyles.marginTopBottom;
const ManageUserBox = Profile.Styles.manageUserBox;
const SubmitButton = (props) => (<div style={{ width: "100%", padding: 5 }}>
        <RaisedButton primary={true} label="submit" fullWidth={true} onClick={props.onSubmit} disabled={!props.canSubmit}></RaisedButton>
    </div>);
const DeleteButton = (props) => (<RaisedButton label="delete" backgroundColor="red" labelColor="white" fullWidth></RaisedButton>);
export const ContactProfileView = (props) => {
    return (<Flexbox flexDirection="row" height="calc(100vh -56px)" style={{ backgroundColor: darkWhite, width: "100%" }}>
            <Flexbox flexGrow={1}/>
            <Flexbox flexDirection="column" minWidth="400px" style={{ overflowY: "auto", overflowX: "hidden", backgroundColor: grey100 }}>
                <Flexbox justifyContent="center" alignItems="center" padding="10px" style={{ backgroundColor: darkBlack }}>
                    {props.member.avatar
        ? <Avatar src={props.member.avatar} size={100}/>
        : <Avatar src="https://thumb.ibb.co/hnoE5k/userdefault.png" size={100}/>}
                </Flexbox>
                <div style={{ marginLeft: "2%", marginRight: "2%" }}>
                    <Paper style={{ width: "100%" }} zDepth={1}>
                        <Flexbox flexDirection={"row"} style={{ margin: "2%" }}>
                            <strong>Username : </strong>
                            <Flexbox flexGrow={1}/>
                            <Col xs={12} md={9}>
                                <FormGroup style={{ margin: "0" }}>
                                    <FormControl value={props.member.username} disabled/>
                                </FormGroup>
                            </Col>
                        </Flexbox>

                        <Flexbox flexDirection={"row"} style={{ margin: "2%" }}>
                            <strong>Name : </strong>
                            <Flexbox flexGrow={1}/>
                            <Col xs={12} md={9}>
                                <FormGroup style={{ margin: "0" }}>
                                    <FormControl value={props.member.firstname + " " + props.member.lastname} disabled/>
                                </FormGroup>
                            </Col>
                        </Flexbox>

                        <Flexbox flexDirection={"row"} style={{ margin: "2%" }}>
                            <strong>Email : </strong>
                            <Flexbox flexGrow={1}/>
                            <Col xs={12} md={9}>
                                <FormGroup style={{ margin: "0" }}>
                                    <FormControl value={props.member.email ? props.member.email : "not set"} disabled/>
                                </FormGroup>
                            </Col>
                        </Flexbox>

                        <Flexbox flexDirection={"row"} style={{ margin: "2%" }}>
                            <strong>Select Org. Group : </strong>
                            <Flexbox flexGrow={1}/>
                            <Col xs={12} md={9}>
                                <SelectOrgChart dropdownItems={props.orgsRoleItems} dropdownValue={props.orgRoleValue} dropdownChange={props.dropdownChange}/>
                            </Col>
                        </Flexbox>

                        <Flexbox flexDirection={"row"} style={{ margin: "2%" }}>
                            <strong>Select Team Role : </strong>
                            <Flexbox flexGrow={1}/>
                            <Col xs={12} md={9}>
                                <SelectTeamRole teamRoleItems={props.teamRoleItems} teamRoleValue={props.teamRoleValue} onTeamRoleChange={props.onTeamRoleChange}/>
                            </Col>
                        </Flexbox>
                    </Paper>
                </div>
                <Flexbox flexGrow={1}/>
                <SubmitButton {...props}/>
            </Flexbox>
            <Flexbox flexGrow={1}/>
        </Flexbox>);
};
