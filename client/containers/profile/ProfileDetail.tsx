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

const GroupDetail = (props) => (
    <MuiThemeProvider>
        <Flex style={{ backgroundColor: Colors.indigo50 }} flexColumn align="center">
            <Box justify="center" align="center" p={2}>
                <h3>Edit Group</h3>
                <p>Enter group informations</p>
            </Box>
            <FileReaderInput
                as="url"
                id="file-input"
                onChange={(props.onFileReaderChange) ? props.onFileReaderChange : () => { }}
                disabled={props.disabledImage}>
                <Avatar
                    src={props.image}
                    size={96}
                    style={styles.avatar}
                />
            </FileReaderInput>
            <TextField
                hintText="group name"
                errorText="This field is required"
                value={props.group_name}
                onChange={props.onGroupNameChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter") props.onSubmit();
                }} />
            <span style={styles.span} />
            <TextField
                hintText="group description"
                value={props.group_description}
                onChange={props.onGroupDescriptionChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter") props.onSubmit();
                }} />
            <span style={styles.span} />
            <RaisedButton primary={true} label="submit" onClick={props.onSubmit} ></RaisedButton>
        </Flex>
    </MuiThemeProvider >
);