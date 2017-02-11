import * as React from "react";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, TextField } from "material-ui";
import Avatar from "material-ui/Avatar";

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
    }
};

interface IComponentProps {
    onSubmit: () => void;
    image?: string;
    group_name: string;
    onGroupNameChange: (e, text) => void;
    group_description?: string;
    onGroupDescriptionChange?: (e, text) => void;
}

const SubmitButton = (props: IComponentProps) => (
    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} ></RaisedButton>
);


export const CreateGroupView = (props: IComponentProps) => (comp: JSX.Element) => (
    <MuiThemeProvider>
        <Flex style={{ backgroundColor: Colors.indigo50 }} flexColumn align="center">
            <Box justify="center" align="center" p={2}>
                <h3>Create Group</h3>
                <p>Enter group informations</p>
            </Box>
            <Avatar
                src={props.image}
                size={96}
                style={styles.avatar}
            />
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
    </MuiThemeProvider >
);