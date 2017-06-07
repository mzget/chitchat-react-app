"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var grade_1 = require("material-ui/svg-icons/action/grade");
var Divider_1 = require("material-ui/Divider");
var info_1 = require("material-ui/svg-icons/action/info");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Subheader_1 = require("material-ui/Subheader");
var getItem = function (props) {
    return props.menus.map(function (item, i, arr) {
        return <List_1.ListItem key={i} primaryText={item} leftIcon={<grade_1.default />} rightIcon={<info_1.default />} onClick={function () { return props.onSelectItem(item); }}/>;
    });
};
exports.MenuListview = function (props) { return (<MuiThemeProvider_1.default>
        <div>
            {(props.title) ? <Subheader_1.default>{props.title}</Subheader_1.default> : null}
            <List_1.List> {(props.menus && props.menus.length > 0) ?
    getItem(props) : null}
            </List_1.List>
            <Divider_1.default />
            <Divider_1.default />
        </div>
    </MuiThemeProvider_1.default>); };
