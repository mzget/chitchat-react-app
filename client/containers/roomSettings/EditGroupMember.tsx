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

import { ChitChatAccount } from "../../chitchat/chats/models/User";

interface IEnhanceProps {
    members: Array<ChitChatAccount>;
    teamMembers: Array<ChitChatAccount>;
    room_id: string;
    initMembers: Array<ChitChatAccount>;
    updateMembers;
    onSubmit;
    onFinished: () => void;
    onToggleItem: (item, checked) => void;
    dispatch;
}
const enhance = compose(
    withState("members", "updateMembers", ({ initMembers }) => initMembers),
    // lifecycle({
    //     componentWillMount() {
    //         this.props.updateMembers(member => this.props.initMembers);
    //     }
    // }),
    withHandlers({
        onToggleItem: (props: IEnhanceProps) => (item, checked) => {
            if (checked) {
                props.members.push(item);
                props.updateMembers((members: Array<ChitChatAccount>) => props.members);
            }
            else {
                let index = props.members.indexOf(item);
                props.members.splice(index);
                props.updateMembers((members: Array<ChitChatAccount>) => props.members);
            }
        },
        onSubmit: (props: IEnhanceProps) => event => {
            let payload = { room_id: props.room_id, members: props.members };
            props.dispatch(editGroupRxActions.editGroupMember(payload));

            props.onFinished();
        }
    })
);
const EditGroupMember = (props: { teamMembers: Array<any>, members: Array<any>, onToggleItem, onSubmit }) => (
    <MuiThemeProvider>
        <Flex style={{ backgroundColor: Colors.indigo50 }} flexColumn align="center">
            {
                console.log(props)
            }
            <List> {
                (props.teamMembers && props.teamMembers.length > 0) ?
                    props.teamMembers.map((item, i, arr) => {
                        let _isContain = props.members.some((member, id, arr) => {
                            if (member._id == item._id) {
                                return true;
                            }
                        });
                        return (<div key={i}>
                            <ListItem
                                leftAvatar={(!!item.avatar) ?
                                    <Avatar src={item.avatar} /> : <Avatar>{item.username.charAt(0)}</Avatar>
                                }
                                rightToggle={
                                    < Toggle
                                        onToggle={(event: object, isInputChecked: boolean) => {
                                            props.onToggleItem(item, isInputChecked);
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
            <RaisedButton label="Submit" primary={true} onClick={props.onSubmit} />
        </Flex>
    </MuiThemeProvider>
);
const EnhanceEditGroupMember = enhance(({
    teamMembers, initMembers, room_id, members, updateMembers, onToggleItem, onSubmit, onFinished
     }: IEnhanceProps) =>
    <EditGroupMember
        teamMembers={teamMembers}
        members={members}
        onToggleItem={onToggleItem}
        onSubmit={onSubmit} />
);

export const ConnectEditGroupMember = connect()(EnhanceEditGroupMember) as any;