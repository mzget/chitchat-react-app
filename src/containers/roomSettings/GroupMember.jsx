"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Colors = require("material-ui/styles/colors");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var Avatar_1 = require("material-ui/Avatar");
exports.GroupMember = function (props) { return (<MuiThemeProvider_1.default>
        <reflexbox_1.Flex flexColumn align="center"> 
            <List_1.List style={{ width: "100%" }}> {(props.members && props.members.length > 0) ?
    props.members.map(function (item, i, arr) { return (<div key={i}>
                            {(!!item.username) ? (<List_1.ListItem leftAvatar={(!!item.avatar) ?
        <Avatar_1.default src={item.avatar}/> : <Avatar_1.default>{item.username.charAt(0)}</Avatar_1.default>} primaryText={(!!item.username) ? item.username : "Empty user name"} secondaryText={<p>
                                            <span style={{ color: Colors.darkBlack }}>{item.email}</span>
                                        </p>}/>) : null}
                            <Divider_1.default inset={true}/>
                        </div>); }) : null}
            </List_1.List>
            <Divider_1.default inset={true}/>
        </reflexbox_1.Flex>
    </MuiThemeProvider_1.default>); };
