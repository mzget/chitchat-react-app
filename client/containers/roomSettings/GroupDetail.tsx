import * as React from "react";
import { connect } from "react-redux";
import { withProps, withState, withHandlers, compose, lifecycle } from "recompose";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, TextField } from "material-ui";
import Avatar from "material-ui/Avatar";

import * as FileReaderInput from "react-file-reader-input";

import * as editGroupRxActions from "../../redux/group/editGroupRxActions";

const styles = {
    span: {
        padding: 8
    },
    avatar: {
        margin: 5
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
const enhance = compose(
    withState("group_name", "setGroupName", ({ group_name }) => group_name),
    withState("group_description", "setGroupDescription", ({ group_description }) => group_description),
    lifecycle({
        componentWillMount() {
        }
    }),
    withHandlers({
        onGroupNameChange: (props: IComponentProps) => (e, text) => {
            props.setGroupName(groupName => text);
        }, onGroupDescriptionChange: (props: IComponentProps) => (e, text) => {
            props.setGroupDescription(group_description => text);
        },
        onFileReaderChange: (props: IComponentProps) => (e, result) => {

        },
        onSubmit: (props: IComponentProps) => event => {
            console.log(props);

            // let payload = { room_id: props.room_id, members: props.members };
            // props.dispatch(editGroupRxActions.editGroupMember(payload));

            // props.onFinished();
        }
    })
);
const GroupDetail = (props: IComponentProps) => (
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
const EnhanceGroupDetail = enhance(({
    image, group_name, group_description, onGroupNameChange, onGroupDescriptionChange, onSubmit, onFileReaderChange
 }: IComponentProps) =>
    <GroupDetail image={image} group_name={group_name} group_description={group_description}
        onSubmit={onSubmit}
        onGroupNameChange={onGroupNameChange}
        onGroupDescriptionChange={onGroupDescriptionChange}
        onFileReaderChange={onFileReaderChange}
    />);
export const ConnectGroupDetail = connect()(EnhanceGroupDetail);