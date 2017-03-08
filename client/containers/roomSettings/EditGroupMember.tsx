import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import { withProps, withState, withHandlers, compose, lifecycle } from "recompose";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import RaisedButton from "material-ui/RaisedButton";
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
import Toggle from "material-ui/Toggle";

import * as editGroupRxActions from "../../redux/group/editGroupRxActions";

import { ChitChatAccount } from "../../../server/scripts/models/User";

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

const EditGroupMember = enhance(({ members, updateMembers, onToggleItem, onSubmit, teamMembers, room_id, initMembers }
    : { members: Array<ChitChatAccount>, teamMembers: Array<ChitChatAccount>, initMembers: Array<ChitChatAccount> }) =>
    <MuiThemeProvider>
        <Flex style={{ backgroundColor: Colors.indigo50 }} flexColumn align="center">
            <List> {
                (teamMembers && teamMembers.length > 0) ?
                    teamMembers.map((item, i, arr) => {
                        let _isContain = members.some((member, id, arr) => {
                            if (member._id == item._id) {
                                return true;
                            }
                        });
                        console.log(_isContain, members, item);
                        return (<div key={i}>
                            <ListItem
                                leftAvatar={(!!item.avatar) ?
                                    <Avatar src={item.avatar} /> : <Avatar>{item.username.charAt(0)}</Avatar>
                                }
                                rightToggle={
                                    < Toggle
                                        onToggle={(event: object, isInputChecked: boolean) => {
                                            onToggleItem(item, isInputChecked);
                                        }}
                                        defaultToggled={_isContain}
                                    />}
                                primaryText={item.username}
                                secondaryText={
                                    <p>
                                        <span style={{ color: Colors.darkBlack }}>{item.email}</span>
                                    </p>
                                }
                            />
                            <Divider inset={true} />
                        </div>);
                    }) : null
            }
            </List>
            <Divider inset={true} />
            <RaisedButton label="Submit" primary={true} onClick={onSubmit} />
        </Flex>
    </MuiThemeProvider>
);

export const ConnectEditGroupMember = connect()(EditGroupMember);