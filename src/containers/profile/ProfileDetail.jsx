"use strict";
var React = require("react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Colors = require("material-ui/styles/colors");
var material_ui_1 = require("material-ui");
var Avatar_1 = require("material-ui/Avatar");
var Subheader_1 = require("material-ui/Subheader");
var FileReaderInput = require("react-file-reader-input");
var react_bootstrap_1 = require("react-bootstrap");
var Styles = require("../../styles/generalStyles");
var PageBox = Styles.generalStyles.pageBox;
var PaddingZero = Styles.generalStyles.paddingZero;
var styles = {
    span: {
        padding: 8
    },
    avatar: {
        margin: 5
    }
};
var getDetailHeight = function () {
    return document.documentElement.clientHeight - (56 + 48);
};
exports.ProfileDetail = function (props) { return (<MuiThemeProvider_1.default>
        <react_bootstrap_1.Row>
            <react_bootstrap_1.Col md={10} mdOffset={1} style={{ backgroundColor: Colors.indigo50 }}>
                <react_bootstrap_1.Row>
                    <react_bootstrap_1.Col md={12}>
                        <Subheader_1.default>Edit you profile</Subheader_1.default>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>

                <react_bootstrap_1.Row>
                    <react_bootstrap_1.Col md={12} id="ProfileDetail" style={{ height: getDetailHeight(), overflow: "auto" }}>
                        <div style={[Object.assign(PageBox, { backgroundColor: "white" }, Styles.generalStyles.marginTop1Percent)]}>
                            <react_bootstrap_1.Row>
                                <react_bootstrap_1.Col md={12} style={{ height: "150px" }}>
                                    <react_bootstrap_1.Col md={6} mdOffset={3} style={Object.assign(Styles.generalStyles.heightFull, Styles.generalStyles.flexCenter)}>
                                        <FileReaderInput as="url" id="file-input" onChange={(props.onFileReaderChange) ? props.onFileReaderChange : function () { }}>
                                            <Avatar_1.default src={props.user.avatar} size={96} style={styles.avatar}/>
                                        </FileReaderInput>
                                    </react_bootstrap_1.Col>
                                </react_bootstrap_1.Col>
                            </react_bootstrap_1.Row>
                            <react_bootstrap_1.Row>
                                <div style={{ marginLeft: "2%", marginRight: "2%" }}>
                                    <react_bootstrap_1.Col md={12}>
                                        <react_bootstrap_1.Col md={12}>
                                            <react_bootstrap_1.Col xs={12} md={4} style={{ paddingTop: "3%" }}>
                                                <label>First Name :</label>
                                            </react_bootstrap_1.Col>
                                            <react_bootstrap_1.Col xs={12} md={8}>
                                                <material_ui_1.TextField hintText="first_name" errorText="This field is required" value={props.user.firstname} onChange={props.onFirstNameChange}/>
                                                <span style={styles.span}/>
                                            </react_bootstrap_1.Col>
                                        </react_bootstrap_1.Col>
                                        <react_bootstrap_1.Col md={12}>
                                            <react_bootstrap_1.Col xs={12} md={4} style={{ paddingTop: "3%" }}>
                                                <label>Last Name :</label>
                                            </react_bootstrap_1.Col>
                                            <react_bootstrap_1.Col xs={12} md={8}>
                                                <material_ui_1.TextField hintText="last_name" errorText="This field is required" value={props.user.lastname} onChange={props.onLastNameChange}/>
                                                <span style={styles.span}/>
                                            </react_bootstrap_1.Col>
                                        </react_bootstrap_1.Col>
                                        <react_bootstrap_1.Col md={12}>
                                            <react_bootstrap_1.Col xs={12} md={4} style={{ paddingTop: "3%" }}>
                                                <label>Tel :</label>
                                            </react_bootstrap_1.Col>
                                            <react_bootstrap_1.Col xs={12} md={8}>
                                                <material_ui_1.TextField hintText="tel" value={props.user.tel} onChange={props.onTelNumberChange}/>
                                                <span style={styles.span}/>
                                            </react_bootstrap_1.Col>
                                        </react_bootstrap_1.Col>
                                        <react_bootstrap_1.Col md={12}>
                                            <react_bootstrap_1.Col xs={12} md={4} style={{ paddingTop: "3%" }}>
                                                <label>Email :</label>
                                            </react_bootstrap_1.Col>
                                            <react_bootstrap_1.Col xs={12} md={8}>
                                                <material_ui_1.TextField hintText="email" value={props.user.email} disabled={true}/>
                                                <span style={styles.span}/>
                                            </react_bootstrap_1.Col>
                                        </react_bootstrap_1.Col>
                                        <react_bootstrap_1.Col md={12}>
                                            <react_bootstrap_1.Col xs={12} md={4} style={{ paddingTop: "3%" }}>
                                                <label>User Role :</label>
                                            </react_bootstrap_1.Col>
                                            <react_bootstrap_1.Col xs={12} md={8}>
                                                <material_ui_1.TextField hintText="user_role" value={props.teamProfile.team_role} disabled={true}/>
                                                <span style={styles.span}/>
                                            </react_bootstrap_1.Col>
                                        </react_bootstrap_1.Col>
                                        <react_bootstrap_1.Col md={12}>
                                            <react_bootstrap_1.Col xs={12} md={4} style={{ paddingTop: "3%" }}>
                                                <label>User Status :</label>
                                            </react_bootstrap_1.Col>
                                            <react_bootstrap_1.Col xs={12} md={8}>
                                                <material_ui_1.TextField hintText="user_status" value={props.user.status} disabled={true}/>
                                                <span style={styles.span}/>
                                            </react_bootstrap_1.Col>
                                        </react_bootstrap_1.Col>
                                    </react_bootstrap_1.Col>
                                </div>
                            </react_bootstrap_1.Row>

                            <react_bootstrap_1.Row>
                                <react_bootstrap_1.Col xs={12} md={10} mdOffset={1} style={Styles.generalStyles.flexEnd}>
                                    <material_ui_1.RaisedButton primary={true} label="submit" onClick={props.onSubmit} style={{ margin: "2%" }}></material_ui_1.RaisedButton>
                                </react_bootstrap_1.Col>
                            </react_bootstrap_1.Row>
                        </div>
                    </react_bootstrap_1.Col>
                </react_bootstrap_1.Row>
            </react_bootstrap_1.Col>
        </react_bootstrap_1.Row>
    </MuiThemeProvider_1.default>); };
