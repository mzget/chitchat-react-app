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
        <Flex style={{ backgroundColor: Colors.indigo50 }} flexColumn align="center">
            <Box justify="center" align="center" p={2}>
                <h3>Edit your profile</h3>
            </Box>
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
            <TextField
                hintText="first_name"
                errorText="This field is required"
                value={props.user.firstname}
                onChange={props.onFirstNameChange} />
            <span style={styles.span} />
            <TextField
                hintText="last_name"
                errorText="This field is required"
                value={props.user.lastname}
                onChange={props.onLastNameChange} />
            <span style={styles.span} />
            <TextField
                hintText="tel"
                value={props.user.tel}
                onChange={props.onTelNumberChange} />
            <span style={styles.span} />
            <TextField
                hintText="email"
                value={props.user.email}
                disabled={true} />
            <span style={styles.span} />
            <TextField
                hintText="user_role"
                value={props.teamProfile.team_role}
                disabled={true} />
            <span style={styles.span} />
            <TextField
                hintText="user_status"
                value={props.user.status}
                disabled={true} />
            <span style={styles.span} />
            <RaisedButton primary={true} label="submit" onClick={props.onSubmit} ></RaisedButton>
        </Flex>
    </MuiThemeProvider >
);