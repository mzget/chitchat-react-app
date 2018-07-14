import * as React from "react";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, TextField } from "material-ui";
import Avatar from "material-ui/Avatar";
import Subheader from 'material-ui/Subheader';
import * as FileReaderInput from "react-file-reader-input";
const Styles = require("../../styles/generalStyles");
const styles = {
    span: {
        padding: 8
    },
    spanGap: {
        height: 8
    },
    avatar: {
        margin: 5
    },
    label: {
        marginLeft: 5,
        marginTop: 10,
        color: Colors.darkBlack,
        fontsize: 16
    },
    textBox: {
        marginRight: 5,
        marginLeft: 5
    }
};
const getDetailHeight = () => {
    return document.documentElement.clientHeight - (56 + 48);
};
export const ProfileDetail = (props) => (<MuiThemeProvider>
        <Flexbox style={{ backgroundColor: Colors.blueGrey50 }} flexDirection="column" height="calc(100vh - 56px)" width="100%">
            <div id="ProfileDetail" style={{ overflowY: "auto" }}>
                <Flexbox flexDirection="column" alignItems="center" flexGrow={1}>
                    <Subheader>Edit your profile</Subheader>
                    <FileReaderInput as="url" id="file-input" onChange={(props.onFileReaderChange) ? props.onFileReaderChange : () => { }}>
                        <Avatar src={props.user.avatar} size={96} style={styles.avatar}/>
                    </FileReaderInput>
                    <span style={styles.spanGap}/>
                    <Flexbox flexDirection="column" justifyContent="center" alignItems="center" style={{ backgroundColor: Colors.darkWhite, margin: 5 }} width="100%">
                        <Flexbox flexDirection="row">
                            <Subheader style={styles.label}> Username :</Subheader>
                            <TextField style={styles.textBox} hintText="username" errorText={(!!props.user.username) ? "" : "This field is required"} value={props.user.username} onChange={props.onUserNameChange} fullWidth={true}/>
                        </Flexbox>
                        <Flexbox flexDirection="row">
                            <Subheader style={styles.label}> First Name :</Subheader>
                            <TextField style={styles.textBox} hintText="first_name" errorText={(!!props.user.firstname) ? "" : "This field is required"} value={props.user.firstname} onChange={props.onFirstNameChange} fullWidth={true}/>
                        </Flexbox>
                        <Flexbox flexDirection="row">
                            <Subheader style={styles.label}>Last Name :</Subheader>
                            <TextField style={styles.textBox} hintText="last_name" errorText={(!!props.user.lastname) ? "" : "This field is required"} value={props.user.lastname} onChange={props.onLastNameChange} fullWidth={true}/>
                        </Flexbox>
                        <Flexbox flexDirection="row">
                            <Subheader style={styles.label}>Tel :</Subheader>
                            <TextField style={styles.textBox} hintText="tel" value={(props.user.tel) ? props.user.tel : ""} onChange={props.onTelNumberChange} fullWidth={true}/>
                        </Flexbox>
                        <Flexbox flexDirection="row">
                            <Subheader style={styles.label}>Email :</Subheader>
                            <TextField style={styles.textBox} hintText="email" value={props.user.email} disabled={true} fullWidth={true}/>
                        </Flexbox>
                        <Flexbox flexDirection="row">
                            <Subheader style={styles.label}>User Role :</Subheader>
                            <TextField style={styles.textBox} hintText="user_role" value={props.teamProfile.team_role} disabled={true} fullWidth={true}/>
                        </Flexbox>
                        <Flexbox flexDirection="row">
                            <Subheader style={styles.label}>User Status :</Subheader>
                            <TextField style={styles.textBox} hintText="user_status" value={props.user.status} disabled={true} fullWidth={true}/>
                        </Flexbox>
                    </Flexbox>
                    <span style={styles.spanGap}/>
                </Flexbox>
                <Flexbox justifyContent="flex-end">
                    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} style={{ margin: "2%" }}></RaisedButton>
                </Flexbox>
            </div>
        </Flexbox>
    </MuiThemeProvider>);
