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
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
    >
        <MoreVertIcon color={Colors.grey400} />
    </IconButton>
);

const rightIconMenu = (
    <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>Delete</MenuItem>
    </IconMenu>
);

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
                                    rightIconButton={rightIconMenu}
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