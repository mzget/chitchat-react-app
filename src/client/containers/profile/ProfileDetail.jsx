import * as React from "react";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, TextField } from "material-ui";
import Avatar from "material-ui/Avatar";
import Subheader from 'material-ui/Subheader';
import * as FileReaderInput from "react-file-reader-input";
const Styles = require("../../../styles/generalStyles");
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
        marginTop: 10
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
        <Flexbox style={{ backgroundColor: Colors.blueGrey50 }} flexDirection="column" minHeight="calc(100vh - 56px)" id="ProfileDetail">
            <Flexbox flexDirection="column" alignItems="center" flexGrow={1}>
                <Subheader>Edit your profile</Subheader>
                <FileReaderInput as="url" id="file-input" onChange={(props.onFileReaderChange) ? props.onFileReaderChange : () => { }}>
                    <Avatar src={props.user.avatar} size={96} style={styles.avatar}/>
                </FileReaderInput>
                <span style={styles.spanGap}/>
                <Flexbox flexDirection="column" style={{ backgroundColor: Colors.darkWhite, margin: 5 }}>
                    <Flexbox flexDirection="row">
                        <p style={styles.label}> First Name :</p>
                        <Flexbox flexGrow={1}/>
                        <TextField style={styles.textBox} hintText="first_name" errorText="This field is required" value={props.user.firstname} onChange={props.onFirstNameChange}/>
                    </Flexbox>
                    <Flexbox flexDirection="row">
                        <p style={styles.label}>Last Name :</p>
                        <Flexbox flexGrow={1}/>
                        <TextField style={styles.textBox} hintText="last_name" errorText="This field is required" value={props.user.lastname} onChange={props.onLastNameChange}/>
                    </Flexbox>
                    <Flexbox flexDirection="row">
                        <p style={styles.label}>Tel :</p>
                        <Flexbox flexGrow={1}/>
                        <TextField style={styles.textBox} hintText="tel" value={(props.user.tel) ? props.user.tel : ""} onChange={props.onTelNumberChange}/>
                    </Flexbox>
                    <Flexbox flexDirection="row">
                        <p style={styles.label}>Email :</p>
                        <Flexbox flexGrow={1}/>
                        <TextField style={styles.textBox} hintText="email" value={props.user.email} disabled={true}/>
                    </Flexbox>
                    <Flexbox flexDirection="row">
                        <p style={styles.label}>User Role :</p>
                        <Flexbox flexGrow={1}/>
                        <TextField style={styles.textBox} hintText="user_role" value={props.teamProfile.team_role} disabled={true}/>
                    </Flexbox>
                    <Flexbox flexDirection="row">
                        <p style={styles.label}>User Status :</p>
                        <Flexbox flexGrow={1}/>
                        <TextField style={styles.textBox} hintText="user_status" value={props.user.status} disabled={true}/>
                    </Flexbox>
                </Flexbox>
                <span style={styles.spanGap}/>
            </Flexbox>
            <Flexbox justifyContent="flex-end">
                <RaisedButton primary={true} label="submit" onClick={props.onSubmit} style={{ margin: "2%" }}></RaisedButton>
            </Flexbox>
        </Flexbox>
    </MuiThemeProvider>);
