import * as React from "react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { RaisedButton, TextField, MenuItem, SelectField, Subheader, Divider, Paper, Card, CardActions, CardHeader, CardText, CardTitle } from "material-ui";

import { SelectOrgChart } from "../../components/SelectOrgChart";
import { SelectTeamRole } from "../../components/SelectTeamRole";
import { ChitChatAccount } from "../../chitchat/chats/models/User";
import { IOrgChart } from "../../chitchat/chats/models/OrgChart";
import { Button, Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,FormControl, Table, FieldGroup, ControlLabel } from 'react-bootstrap';
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
const DeleteButton = (props: IComponentProps) => (
    <RaisedButton  label="delete" backgroundColor="red" labelColor="white"  fullWidth></RaisedButton>
);


export const ContactProfileView = (props: IComponentProps) => {

    return (
        <MuiThemeProvider>
            <Row >
                <Col md={6} mdOffset={3}>
                    <Card>
                        <CardTitle title="User Profile" subtitle="User Profile" />
                    </Card>
                    <div style={Object.assign(Styles.generalStyles.paddingTop2Percent, Styles.generalStyles.paddingLeft2Percent, BoxShadow, { padding: "0"})}>
                                
                                <div style={Object.assign({ height: "200px", backgroundColor: "#333b3e"}, Styles.generalStyles.flexCenter)}>
                                    {props.member.avatar ? <img src={props.member.avatar} width="150" height="150" /> : <img src="https://thumb.ibb.co/hnoE5k/userdefault.png" width="150" height="150" />}                                    
                                    
                                </div>
                                <div style={{marginLeft: "2%", marginRight: "2%"}}>
                                    <Row style={Styles.generalStyles.marginZero}>
                                        <div style={Object.assign(ManageUserBox)}>
                                            <Col md={10} mdOffset={1} style={Object.assign(Styles.generalStyles.flexEnd, Styles.generalStyles.paddingZero)}>
                                                <Col xs={6} md={4} style={Styles.generalStyles.paddingZero}>
                                                    <FormGroup controlId="formControlsSelect">
                                                        <ControlLabel>Manage User</ControlLabel>
                                                        <FormControl componentClass="select" placeholder="select">
                                                            <option value="select" disabled selected>Select action</option>
                                                            <option value="other">Delete User</option>
                                                        </FormControl>
                                                    </FormGroup>
                                                </Col>
                                            </Col>
                                        </div>
                                    </Row>
                                    <Row style={Styles.generalStyles.marginZero}>
                                        <Col md={10} mdOffset={1} style={Styles.generalStyles.paddingZero}>
                                            <Panel>
                                                <Row>
                                                    <Col md={12}>
                                                        <Col xs={12} md={3}>
                                                            <strong>Username : </strong>
                                                        </Col>
                                                        <Col xs={12} md={9}>
                                                            <FormGroup style={{margin: "0"}}>
                                                                <FormControl  value={props.member.username} disabled /> 
                                                            </FormGroup>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                                
                                                <Row style={{paddingTop: "2%"}}>
                                                    <Col md={12}>
                                                        <Col xs={12} md={3}>
                                                            <strong>Name : </strong>
                                                        </Col>
                                                        <Col xs={12} md={9}>
                                                            <FormGroup style={{margin: "0"}}>
                                                                <FormControl  value={props.member.firstname+" "+props.member.lastname} disabled /> 
                                                            </FormGroup>
                                                        </Col>
                                                    </Col>
                                                </Row>

                                                <Row style={{paddingTop: "2%"}}>
                                                    <Col md={12}>
                                                        <Col xs={12} md={3}>
                                                            <strong>Email : </strong>
                                                        </Col>
                                                        <Col xs={12} md={9}>
                                                            <FormGroup style={{margin: "0"}}>
                                                                <FormControl  value={props.member.email ? props.member.email : "not set"} disabled /> 
                                                            </FormGroup>
                                                        </Col>
                                                    </Col>
                                                </Row>

                                                <Row style={{paddingTop: "2%"}}>
                                                    <Col md={12}>
                                                        <Col xs={12} md={3}>
                                                            <strong>Select Org. Group : </strong> 
                                                        </Col>
                                                        <Col xs={12} md={9}>
                                                            <SelectOrgChart dropdownItems={props.dropdownItems} dropdownValue={props.dropdownValue} dropdownChange={props.dropdownChange} />
                                                        </Col>
                                                    </Col>
                                                </Row>

                                                <Row style={{paddingTop: "2%"}}>
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

                                    <Row>
                                        <Col md={10} mdOffset={1} >
                                            <Row>
                                                <Col md={12} >
                                                    <FormGroup>
                                                        <FormControl.Static style={Styles.generalStyles.flexEnd}>
                                                            <SubmitButton  {...props} />   
                                                        </FormControl.Static>
                                                    </FormGroup>                      
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                
                    </div>
                </Col>
            </Row>
        </MuiThemeProvider>
    );
};