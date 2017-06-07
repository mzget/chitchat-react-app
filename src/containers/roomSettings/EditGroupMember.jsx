"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var Avatar_1 = require("material-ui/Avatar");
exports.EditGroupMember = function (props) { return (<MuiThemeProvider_1.default>
        <reflexbox_1.Flex flexColumn align="center">
            <List_1.List style={{ width: "100%" }}> {(props.members && props.members.length > 0) ?
    props.members.map(function (item, i, arr) {
        return (<div key={i}>
                                <List_1.ListItem leftAvatar={(!!item.avatar) ?
            <Avatar_1.default src={item.avatar} size={30}/> :
            (!!item.username) ?
                <Avatar_1.default size={30}>{item.username.charAt(0)}</Avatar_1.default> :
                null} primaryText={item.username} rightIconButton={props.rightIconButton(item)}/>
                                <Divider_1.default inset={true}/>
                            </div>);
    }) : null}
            </List_1.List>
        </reflexbox_1.Flex>
    </MuiThemeProvider_1.default>); };
