import * as React from "react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { RaisedButton, TextField, MenuItem, SelectField, Subheader, Divider, Paper, Card, CardActions, CardHeader, CardText } from "material-ui";

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
    {
        console.log(props);
    }
    return (
        <MuiThemeProvider>
            <Row >
                <Col md={6} mdOffset={3}>
                    <div style={Object.assign(Styles.generalStyles.paddingTop2Percent, Styles.generalStyles.paddingLeft2Percent, BoxShadow, {height: "calc(100vh - 56px)", padding: "0"})}>
                        {/*<Panel collapsible defaultExpanded  bsStyle="primary">*/}
                                
                                <div style={Object.assign({ height: "200px", backgroundColor: "#333b3e"}, Styles.generalStyles.flexCenter)}>
                                    {props.member.avatar ? <img src={props.member.avatar} width="150" height="150" /> : <img src="https://thumb.ibb.co/hnoE5k/userdefault.png" width="150" height="150" />}                                    
                                    
                                </div>
                     
                                <div>
                             
                                    <div style={Object.assign(ProfileBox, Styles.generalStyles.flexStart)}>
                                        <Col xs={4} md={3}>
                                            <strong>Username : </strong>
                                        </Col>
                                        <Col xs={8} md={9}>
                                            <FormGroup style={{margin: "0"}}>
                                                <FormControl  value={props.member.username} disabled /> 
                                            </FormGroup>
                                        </Col>
                                    </div>

                                    <div style={Object.assign(ProfileBox, Styles.generalStyles.flexStart)}>
                                        <Col xs={4} md={3}>
                                            <strong>Name : </strong>
                                        </Col>
                                        <Col xs={8} md={9}>
                                            <FormGroup style={{margin: "0"}}>
                                                <FormControl  value={props.member.firstname+" "+props.member.lastname} disabled /> 
                                            </FormGroup>
                                            
                                        </Col>
                                    </div>
                                    <div style={Object.assign(ProfileBox, Styles.generalStyles.flexStart)}>
                                        <Col xs={4} md={3}>
                                            <strong>Email : </strong>
                                        </Col>
                                        <Col xs={8} md={9}>
                                            <FormGroup style={{margin: "0"}}>
                                                <FormControl  value={props.member.email ? props.member.email : "not set"} disabled /> 
                                            </FormGroup>

                                        </Col>
                                    </div>
                                
                                    <div style={Object.assign(DropdownBox, Styles.generalStyles.flexStart)}>
                                        <Col xs={4} md={3}>
                                            <strong>Select Org. Group : </strong> 
                                        </Col>
                                        <Col xs={8} md={9}>
                                            <SelectOrgChart dropdownItems={props.dropdownItems} dropdownValue={props.dropdownValue} dropdownChange={props.dropdownChange} />
                                        </Col>
                                    </div>
                                    <div style={Object.assign(DropdownBox, Styles.generalStyles.flexCenter)}>
                                        <Col xs={4} md={3}>
                                            <strong>Select Team Role : </strong> 
                                        </Col>
                                        <Col xs={8} md={9}>
                                            <SelectTeamRole teamRoleItems={props.teamRoleItems} teamRoleValue={props.teamRoleValue} onTeamRoleChange={props.onTeamRoleChange} />
                                        </Col>
                                    </div>
                                </div>
                                <div style={Styles.generalStyles.flexCenter}>
                                    <Col md={12}>
                                        <FormGroup>
                                            <FormControl.Static style={{textAlign: "right"}}>
                                                <SubmitButton {...props} />   
                                            </FormControl.Static>
                                        </FormGroup>                      
                                    </Col>
                                </div>
                        {/*</Panel>*/}
                    </div>
                </Col>
            </Row>
        </MuiThemeProvider>
    );
};