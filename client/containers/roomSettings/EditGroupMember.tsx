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

export const EditGroupMember = (props: { members: Array<any>, onToggleItem }) => (
    <MuiThemeProvider>
        <Flex flexColumn align="center">
            <List style={{ width: "100%" }}> {
                (props.members && props.members.length > 0) ?
                    props.members.map((item, i, arr) => {
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
                                />
                                <Divider inset={true} />
                            </div>);
                    }) : null
            }
            </List>
            <Divider inset={true} />
        </Flex>
    </MuiThemeProvider>
);