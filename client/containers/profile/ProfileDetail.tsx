import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { RaisedButton, TextField } from "material-ui";
import Avatar from "material-ui/Avatar";

import * as FileReaderInput from "react-file-reader-input";

import { ChitChatAccount } from "../../chitchat/chats/models/User";
import { ITeamProfile } from "../../chitchat/chats/models/TeamProfile";
import { Button, Row, Col, Panel, FormGroup, FormControl, FieldGroup, ControlLabel } from "react-bootstrap";
import { Card, CardActions, CardHeader, CardText, CardTitle } from "material-ui";
const Styles = require("../../styles/generalStyles");
const PageBox = Styles.generalStyles.pageBox;
const PaddingZero = Styles.generalStyles.paddingZero;

const styles = {
    span: {
        padding: 8
    },
    avatar: {
        margin: 5
    }
};

interface IProfileDetailProps {
    user: ChitChatAccount;
    teamProfile: ITeamProfile;
    onFirstNameChange: (event, newValue) => void;
    onLastNameChange: (event, newValue) => void;
    onTelNumberChange: (event, newValue) => void;
    onFileReaderChange: (event, results) => void;
    onSubmit: () => void;
}

export const ProfileDetail = (props: IProfileDetailProps) => (
    <MuiThemeProvider>
        <Row >
            <Col md={10} mdOffset={1}>
                <Row>
                    <Col md={12}>
                        <Card>
                            <CardTitle title="Edit you profile" subtitle="Edit you profile" />
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <div style={Object.assign(PageBox, { backgroundColor: "white" }, Styles.generalStyles.marginTop1Percent)}>
                            <Row>
                                <Col md={12} style={{ height: "150px" }}>
                                    <Col md={6} mdOffset={3} style={Object.assign(Styles.generalStyles.heightFull, Styles.generalStyles.flexCenter)}>
                                        <FileReaderInput
                                            as="url"
                                            id="file-input"
                                            onChange={(props.onFileReaderChange) ? props.onFileReaderChange : () => { }} >
                                            <Avatar
                                                src={props.user.avatar}
                                                size={96}
                                                style={styles.avatar}
                                            />
                                        </FileReaderInput>
                                    </Col>
                                </Col>
                            </Row>
                            <Row>
                                <div style={{ marginLeft: "2%", marginRight: "2%" }}>
                                    <Col md={10} mdOffset={1}>
                                        <Panel style={Object.assign(Styles.generalStyles.gridCenter)}>
                                            <Col md={12} >
                                                <Col xs={12} md={3} style={{ paddingTop: "3%" }}>
                                                    <label>First Name :</label>
                                                </Col>
                                                <Col xs={12} md={9}>
                                                    <TextField
                                                        hintText="first_name"
                                                        errorText="This field is required"
                                                        value={props.user.firstname}
                                                        onChange={props.onFirstNameChange} />
                                                    <span style={styles.span} />
                                                </Col>
                                            </Col>
                                            <Col md={12}>
                                                <Col xs={12} md={3} style={{ paddingTop: "3%" }}>
                                                    <label>Last Name :</label>
                                                </Col>
                                                <Col xs={12} md={9}>
                                                    <TextField
                                                        hintText="last_name"
                                                        errorText="This field is required"
                                                        value={props.user.lastname}
                                                        onChange={props.onLastNameChange} />
                                                    <span style={styles.span} />
                                                </Col>
                                            </Col>
                                            <Col md={12}>
                                                <Col xs={12} md={3} style={{ paddingTop: "3%" }}>
                                                    <label>Tel :</label>
                                                </Col>
                                                <Col xs={12} md={9}>
                                                    <TextField
                                                        hintText="tel"
                                                        value={props.user.tel}
                                                        onChange={props.onTelNumberChange} />
                                                    <span style={styles.span} />
                                                </Col>
                                            </Col>
                                            <Col md={12}>
                                                <Col xs={12} md={3} style={{ paddingTop: "3%" }}>
                                                    <label>Email :</label>
                                                </Col>
                                                <Col xs={12} md={9}>
                                                    <TextField
                                                        hintText="email"
                                                        value={props.user.email}
                                                        disabled={true} />
                                                    <span style={styles.span} />
                                                </Col>
                                            </Col>
                                            <Col md={12}>
                                                <Col xs={12} md={3} style={{ paddingTop: "3%" }}>
                                                    <label>User Role :</label>
                                                </Col>
                                                <Col xs={12} md={9}>
                                                    <TextField
                                                        hintText="user_role"
                                                        value={props.teamProfile.team_role}
                                                        disabled={true} />
                                                    <span style={styles.span} />
                                                </Col>
                                            </Col>
                                            <Col md={12}>
                                                <Col xs={12} md={3} style={{ paddingTop: "3%" }}>
                                                    <label>User Status :</label>
                                                </Col>
                                                <Col xs={12} md={9}>
                                                    <TextField
                                                        hintText="user_status"
                                                        value={props.user.status}
                                                        disabled={true} />
                                                    <span style={styles.span} />
                                                </Col>
                                            </Col>

                                        </Panel>
                                    </Col>
                                </div>
                            </Row>

                            <Row>
                                <Col xs={12} md={10} mdOffset={1} style={Styles.generalStyles.flexEnd}>
                                    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} style={{ margin: "2%" }}></RaisedButton>
                                </Col>

                            </Row>

                        </div>

                    </Col>
                </Row>




            </Col>
        </Row>
    </MuiThemeProvider >
);