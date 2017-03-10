import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

import { RaisedButton, TextField } from "material-ui";
import Avatar from "material-ui/Avatar";

import * as FileReaderInput from "react-file-reader-input";

const styles = {
    span: {
        padding: 8
    },
    avatar: {
        margin: 5
    }
};

interface IProfileDetailProps {
    image;
    first_name;
    last_name;
    email;
    onFirstNameChange: (event, newValue) => void;
    onLastNameChange: (event, newValue) => void;
    onFileReaderChange;
    onSubmit;
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
                    src={props.image}
                    size={96}
                    style={styles.avatar}
                />
            </FileReaderInput>
            <TextField
                hintText="email"
                value={props.email}
                disabled={true} />
            <span style={styles.span} />
            <TextField
                hintText="first_name"
                errorText="This field is required"
                value={props.first_name}
                onChange={props.onFirstNameChange} />
            <span style={styles.span} />
            <TextField
                hintText="last_name"
                value={props.last_name}
                onChange={props.onLastNameChange} />
            <span style={styles.span} />
            <RaisedButton primary={true} label="submit" onClick={props.onSubmit} ></RaisedButton>
        </Flex>
    </MuiThemeProvider >
);