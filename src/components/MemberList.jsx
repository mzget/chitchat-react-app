"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var FontIcon_1 = require("material-ui/FontIcon");
var IconButton_1 = require("material-ui/IconButton");
var colors_1 = require("material-ui/styles/colors");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Avatar_1 = require("material-ui/Avatar");
var Toggle_1 = require("material-ui/Toggle");
var addMemberView = function (item, onAdded) { return (<IconButton_1.default tooltip="Add Member" onClick={function () { return onAdded(item); }} style={{ marginTop: 0 }}>
        <FontIcon_1.default color={colors_1.indigoA700} className="material-icons">add_circle</FontIcon_1.default>
    </IconButton_1.default>); };
var renderList = function (props) { return props.items.map(function (item, i) {
    return <div key={i}>
        <List_1.ListItem onClick={(!!props.onSelected) ? function () { return props.onSelected(item); } : function () { }} leftAvatar={(!!item.avatar) ?
        <Avatar_1.default size={32} src={item.avatar}/> : <Avatar_1.default size={32}>{item.username.charAt(0)}</Avatar_1.default>} rightIcon={(props.onAdded) ? addMemberView(item, props.onAdded) : null} rightToggle={(props.rightToggle) ?
        <Toggle_1.default onToggle={function (event, isInputChecked) {
            props.onToggleItem(item, isInputChecked);
        }} disabled={true} defaultToggled={true}/> : null} primaryText={item.username}/>
        <Divider_1.default inset={true}/>
    </div>;
}); };
exports.MemberList = function (props) { return (<MuiThemeProvider_1.default>
        <List_1.List>
            {(!!props.items) ? renderList(props) : null}
        </List_1.List>
    </MuiThemeProvider_1.default>); };
