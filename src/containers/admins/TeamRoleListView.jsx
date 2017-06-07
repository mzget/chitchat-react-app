"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var Subheader_1 = require("material-ui/Subheader");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var renderList = function (props) { return (props.items.map(function (item, i) {
    return (<div key={i}>
            <List_1.ListItem onClick={function () { return props.onSelected(item); }} rightIcon={null} primaryText={item}/>
            <Divider_1.default inset={true}/>
        </div>);
})); };
exports.TeamRoleList = function (props) { return (<MuiThemeProvider_1.default>
        <Subheader_1.default>Team roles.</Subheader_1.default>
        <List_1.List>
            {(!!props.items) ? renderList(props) : null}
        </List_1.List>
    </MuiThemeProvider_1.default>); };
