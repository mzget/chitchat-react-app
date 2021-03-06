import * as React from "react";
import { connect } from "react-redux";
import Flexbox from "flexbox-react";
import { withRouter } from "react-router-dom";
import { withState, withHandlers, compose, lifecycle, ComponentEnhancer } from "recompose";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Subheader from "material-ui/Subheader";
import RaisedButton from "material-ui/RaisedButton";
import TextField from 'material-ui/TextField';
import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";

import { MemberImp } from "../chitchat/chats/models/MemberImp"


export const EditGroupMember = (props: { members: Array<MemberImp>, rightIconButton?: (item: any) => JSX.Element }) => {
    return (
        <MuiThemeProvider>
            <Flexbox alignItems="center">
                <List style={{ width: "100%" }}> {
                    (props.members && props.members.length > 0)
                        ? props.members.map((item, i, arr) => {
                            if (!!item && !!item.username) {
                                return (
                                    <div key={i} >
                                        <ListItem
                                            leftAvatar={(!!item.avatar) ?
                                                <Avatar src={item.avatar} size={30} /> :
                                                (!!item.username) ?
                                                    <Avatar size={30}>{item.username.charAt(0)}</Avatar> :
                                                    null
                                            }
                                            primaryText={item.username}
                                            rightIconButton={(props.rightIconButton) ? props.rightIconButton(item) : null}
                                        />
                                        <Divider inset={true} />
                                    </div>)
                            }
                            else {
                                return null;
                            }
                        }) : null
                }
                </List>
            </Flexbox>
        </MuiThemeProvider>
    )
};