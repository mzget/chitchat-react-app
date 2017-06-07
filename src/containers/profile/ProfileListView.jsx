"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Avatar_1 = require("material-ui/Avatar");
exports.ProfileListView = function (props) { return (<MuiThemeProvider_1.default>
        {(props.item) ?
    <List_1.List>
                    <List_1.ListItem onClick={function () { return props.onSelected(props.item); }} leftAvatar={(!!props.item.avatar) ?
        <Avatar_1.default src={props.item.avatar}/> : <Avatar_1.default>{props.item.username.charAt(0)}</Avatar_1.default>} rightIcon={null} primaryText={<span>{props.item.username}</span>} secondaryText={<p>
                                <span>{props.item.email}</span>
                            </p>}/>
                </List_1.List> : null}
    </MuiThemeProvider_1.default>); };
