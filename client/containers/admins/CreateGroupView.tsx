import * as React from "react";
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
    box: {
        bottom: 0,
        position: "absolute"
    },
    avatar: {
        margin: 5
    },
    toolbar: {
        height: 56
    }
};

interface IComponentProps {
    onSubmit: () => void;
    image?: string;
    disabledImage?: boolean;
    group_name: string;
    onGroupNameChange: (e, text) => void;
    group_description?: string;
    onGroupDescriptionChange?: (e, text) => void;
    onFileReaderChange?: (e, result) => void;
}

const SubmitButton = (props: IComponentProps) => (
    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} ></RaisedButton>
);

export const CreateGroupView = (props: IComponentProps) => (comp: JSX.Element) => (
    <MuiThemeProvider>
        <div style={{ height: (document.documentElement.clientHeight - styles.toolbar.height), backgroundColor: Colors.indigo50 }}>
            <Flex flexColumn align="center">
                <Box justify="center" align="center" p={2}>
                    <h3>Create Group</h3>
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
                {comp}
                <SubmitButton {...props} />
            </Flex>
        </div>
    </MuiThemeProvider >
);