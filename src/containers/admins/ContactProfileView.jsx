"use strict";
var React = require("react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var material_ui_1 = require("material-ui");
var SelectOrgChart_1 = require("../../components/SelectOrgChart");
var SelectTeamRole_1 = require("../../components/SelectTeamRole");
var react_bootstrap_1 = require("react-bootstrap");
var Styles = require("../../styles/generalStyles");
var Profile = require("../../styles/profile");
var BoxShadow = Profile.Styles.boxShadow;
var ProfileBox = Profile.Styles.profileBox;
var DropdownBox = Profile.Styles.dropdownBox;
var MarginTopBottom = Styles.generalStyles.marginTopBottom;
var ManageUserBox = Profile.Styles.manageUserBox;
var SubmitButton = function (props) { return (<material_ui_1.RaisedButton primary={true} label="submit" onClick={props.onSubmit}></material_ui_1.RaisedButton>); };
var DeleteButton = function (props) { return (<material_ui_1.RaisedButton label="delete" backgroundColor="red" labelColor="white" fullWidth></material_ui_1.RaisedButton>); };
exports.ContactProfileView = function (props) {
    return (<MuiThemeProvider_1.default>
            <react_bootstrap_1.Row>
                <react_bootstrap_1.Col md={6} mdOffset={3}>
                    <material_ui_1.Card>
                        <material_ui_1.CardTitle title="User Profile" subtitle="User Profile"/>
                    </material_ui_1.Card>
                    <div style={Object.assign(Styles.generalStyles.paddingTop2Percent, Styles.generalStyles.paddingLeft2Percent, BoxShadow, { padding: "0" })}>
                                
                                <div style={Object.assign({ height: "200px", backgroundColor: "#333b3e" }, Styles.generalStyles.flexCenter)}>
                                    {props.member.avatar ? <img src={props.member.avatar} width="150" height="150"/> : <img src="https://thumb.ibb.co/hnoE5k/userdefault.png" width="150" height="150"/>}                                    
                                    
                                </div>
                                <div style={{ marginLeft: "2%", marginRight: "2%" }}>
                                    <react_bootstrap_1.Row style={Styles.generalStyles.marginZero}>
                                        <div style={Object.assign(ManageUserBox)}>
                                            <react_bootstrap_1.Col md={10} mdOffset={1} style={Object.assign(Styles.generalStyles.flexEnd, Styles.generalStyles.paddingZero)}>
                                                <react_bootstrap_1.Col xs={6} md={4} style={Styles.generalStyles.paddingZero}>
                                                    <react_bootstrap_1.FormGroup controlId="formControlsSelect">
                                                        <react_bootstrap_1.ControlLabel>Manage User</react_bootstrap_1.ControlLabel>
                                                        <react_bootstrap_1.FormControl componentClass="select" placeholder="select">
                                                            <option value="select" disabled selected>Select action</option>
                                                            <option value="other">Delete User</option>
                                                        </react_bootstrap_1.FormControl>
                                                    </react_bootstrap_1.FormGroup>
                                                </react_bootstrap_1.Col>
                                            </react_bootstrap_1.Col>
                                        </div>
                                    </react_bootstrap_1.Row>
                                    <react_bootstrap_1.Row style={Styles.generalStyles.marginZero}>
                                        <react_bootstrap_1.Col md={10} mdOffset={1} style={Styles.generalStyles.paddingZero}>
                                            <react_bootstrap_1.Panel>
                                                <react_bootstrap_1.Row>
                                                    <react_bootstrap_1.Col md={12}>
                                                        <react_bootstrap_1.Col xs={12} md={3}>
                                                            <strong>Username : </strong>
                                                        </react_bootstrap_1.Col>
                                                        <react_bootstrap_1.Col xs={12} md={9}>
                                                            <react_bootstrap_1.FormGroup style={{ margin: "0" }}>
                                                                <react_bootstrap_1.FormControl value={props.member.username} disabled/> 
                                                            </react_bootstrap_1.FormGroup>
                                                        </react_bootstrap_1.Col>
                                                    </react_bootstrap_1.Col>
                                                </react_bootstrap_1.Row>
                                                
                                                <react_bootstrap_1.Row style={{ paddingTop: "2%" }}>
                                                    <react_bootstrap_1.Col md={12}>
                                                        <react_bootstrap_1.Col xs={12} md={3}>
                                                            <strong>Name : </strong>
                                                        </react_bootstrap_1.Col>
                                                        <react_bootstrap_1.Col xs={12} md={9}>
                                                            <react_bootstrap_1.FormGroup style={{ margin: "0" }}>
                                                                <react_bootstrap_1.FormControl value={props.member.firstname + " " + props.member.lastname} disabled/> 
                                                            </react_bootstrap_1.FormGroup>
                                                        </react_bootstrap_1.Col>
                                                    </react_bootstrap_1.Col>
                                                </react_bootstrap_1.Row>

                                                <react_bootstrap_1.Row style={{ paddingTop: "2%" }}>
                                                    <react_bootstrap_1.Col md={12}>
                                                        <react_bootstrap_1.Col xs={12} md={3}>
                                                            <strong>Email : </strong>
                                                        </react_bootstrap_1.Col>
                                                        <react_bootstrap_1.Col xs={12} md={9}>
                                                            <react_bootstrap_1.FormGroup style={{ margin: "0" }}>
                                                                <react_bootstrap_1.FormControl value={props.member.email ? props.member.email : "not set"} disabled/> 
                                                            </react_bootstrap_1.FormGroup>
                                                        </react_bootstrap_1.Col>
                                                    </react_bootstrap_1.Col>
                                                </react_bootstrap_1.Row>

                                                <react_bootstrap_1.Row style={{ paddingTop: "2%" }}>
                                                    <react_bootstrap_1.Col md={12}>
                                                        <react_bootstrap_1.Col xs={12} md={3}>
                                                            <strong>Select Org. Group : </strong> 
                                                        </react_bootstrap_1.Col>
                                                        <react_bootstrap_1.Col xs={12} md={9}>
                                                            <SelectOrgChart_1.SelectOrgChart dropdownItems={props.dropdownItems} dropdownValue={props.dropdownValue} dropdownChange={props.dropdownChange}/>
                                                        </react_bootstrap_1.Col>
                                                    </react_bootstrap_1.Col>
                                                </react_bootstrap_1.Row>

                                                <react_bootstrap_1.Row style={{ paddingTop: "2%" }}>
                                                    <react_bootstrap_1.Col md={12}>
                                                            <react_bootstrap_1.Col xs={12} md={3}>
                                                                <strong>Select Team Role : </strong> 
                                                            </react_bootstrap_1.Col>
                                                            <react_bootstrap_1.Col xs={12} md={9}>
                                                                <SelectTeamRole_1.SelectTeamRole teamRoleItems={props.teamRoleItems} teamRoleValue={props.teamRoleValue} onTeamRoleChange={props.onTeamRoleChange}/>
                                                            </react_bootstrap_1.Col>
                                                    </react_bootstrap_1.Col>
                                                </react_bootstrap_1.Row>
                                            
                                            </react_bootstrap_1.Panel>
                                        </react_bootstrap_1.Col>

                                    </react_bootstrap_1.Row>

                                    <react_bootstrap_1.Row>
                                        <react_bootstrap_1.Col md={10} mdOffset={1}>
                                            <react_bootstrap_1.Row>
                                                <react_bootstrap_1.Col md={12}>
                                                    <react_bootstrap_1.FormGroup>
                                                        <react_bootstrap_1.FormControl.Static style={Styles.generalStyles.flexEnd}>
                                                            <SubmitButton {...props}/>   
                                                        </react_bootstrap_1.FormControl.Static>
                                                    </react_bootstrap_1.FormGroup>                      
                                                </react_bootstrap_1.Col>
                                            </react_bootstrap_1.Row>
                                        </react_bootstrap_1.Col>
                                    </react_bootstrap_1.Row>
                                </div>
                                
                    </div>
                </react_bootstrap_1.Col>
            </react_bootstrap_1.Row>
        </MuiThemeProvider_1.default>);
};
