import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import { withRouter } from "react-router-dom";
import { withProps, withState, withHandlers, compose, lifecycle, ComponentEnhancer } from "recompose";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";
import RaisedButton from "material-ui/RaisedButton";
import TextField from 'material-ui/TextField';
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
import Toggle from "material-ui/Toggle";

import { EditGroupMemberEnhancer, IEnhanceProps } from "./EditGroupMemberEnhancer";

export const EditGroupMember = (props: { members: Array<any>, onToggleItem, onSubmit }) => (
    <MuiThemeProvider>
        <Flex style={{ backgroundColor: Colors.indigo50 }} flexColumn align="center">
            <Subheader>ADD MEMBERS</Subheader>
            <div style={{width: "90%"}}>
                <TextField
                    hintText="Enter name or email address"
                /><br />
            </div>
            <List style={{width: "100%"}}> {
                (props.members && props.members.length > 0) ?
                    props.members.map((item, i, arr) => {
                        return (<div key={i} >
                            <ListItem
                                leftAvatar={(!!item.avatar) ?
                                    <Avatar src={item.avatar} /> : <Avatar>{item.username.charAt(0)}</Avatar>
                                }
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

export const EditGroupMemberEnhanced = EditGroupMemberEnhancer(({
            room_id, members, updateMembers, onToggleItem, onSubmit, onFinished
     }: IEnhanceProps) =>
    <EditGroupMember
        members={members}
        onToggleItem={onToggleItem}
        onSubmit={onSubmit} />
) as React.ComponentClass<{ room_id, members, match, onFinished }>;