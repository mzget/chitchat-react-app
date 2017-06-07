"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var grade_1 = require("material-ui/svg-icons/action/grade");
var Divider_1 = require("material-ui/Divider");
var info_1 = require("material-ui/svg-icons/action/info");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var getItem = function (props) {
    return props.items.map(function (item, i, arr) {
        return <List_1.ListItem key={i} primaryText={item.name} leftIcon={<grade_1.default />} rightIcon={(props.actionChild) ? props.actionChild : <info_1.default />} onClick={function () { return props.onSelectItem(item); }}/>;
    });
};
exports.TeamListView = function (props) { return (<MuiThemeProvider_1.default>
        <div>
            <List_1.List>
                {(props.items && props.items.length > 0) ?
    getItem(props) : null}
            </List_1.List>
            <Divider_1.default />
        </div>
    </MuiThemeProvider_1.default>); };
