import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import { withProps, withState, withHandlers, compose, flattenProp } from "recompose";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import RaisedButton from "material-ui/RaisedButton";

import { MemberList } from "../chatlist/MemberList";

import * as editGroupRxActions from "../../redux/group/editGroupRxActions";

const enhance = compose(
    withState("members", "updateMembers", []),
    withHandlers({
        updateMembers: (props: IComponentProps) => (item, checked) => {
            if (checked) {
                props.members.push(item);
            }
            else {
                let index = props.members.indexOf(item);
                props.members.splice(index, 1);
            }
        },
        onSubmit: (props: IComponentProps) => event => {
            console.log(props);
            let payload = { room_id: props.room_id, members: props.members };
            props.dispatch(editGroupRxActions.editGroupMember(payload));
        }
    }),
    flattenProp("teamMembers"),
    flattenProp("room_id")
);
interface IComponentProps {
    teamMembers: Array<any>;
    room_id: string;
    members: Array<any>;
    updateMembers;
    onSubmit;
    dispatch;
}

const EditGroupMember = enhance(({ members, updateMembers, onSubmit, teamMembers, room_id }) =>
    <MuiThemeProvider>
        <Flex style={{ backgroundColor: Colors.indigo50 }} flexColumn align="center">
            <MemberList
                onSelected={null}
                value={teamMembers}
                rightToggle={true}
                onToggleItem={updateMembers}
            />
            <RaisedButton label="Submit" primary={true} onClick={onSubmit} />
        </Flex>
    </MuiThemeProvider>
);

export const ConnectEditGroupMember = connect()(EditGroupMember);