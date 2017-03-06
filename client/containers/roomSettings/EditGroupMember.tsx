import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import { withProps, withState, withHandlers, compose, lifecycle } from "recompose";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import RaisedButton from "material-ui/RaisedButton";

import { MemberList } from "../chatlist/MemberList";

import * as editGroupRxActions from "../../redux/group/editGroupRxActions";

interface IComponentProps {
    members: Array<any>;
    teamMembers: Array<any>;
    room_id: string;
    updateMembers;
    onSubmit;
    dispatch;
}
const enhance = compose(
    withState("members", "updateMembers", []),
    lifecycle({
        componentWillMount() {
            this.props.updateMembers(member => this.props.initMembers);
        }
    }),
    withHandlers({
        onToggleItem: (props: IComponentProps) => (item, checked) => {
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
    })
);

const EditGroupMember = enhance(({ onToggleItem, onSubmit, teamMembers, room_id, initMembers }) =>
    <MuiThemeProvider>
        <Flex style={{ backgroundColor: Colors.indigo50 }} flexColumn align="center">
            <MemberList
                onSelected={null}
                value={teamMembers}
                rightToggle={true}
                onToggleItem={onToggleItem}
            />
            <RaisedButton label="Submit" primary={true} onClick={onSubmit} />
        </Flex>
    </MuiThemeProvider>
);

export const ConnectEditGroupMember = connect()(EditGroupMember);