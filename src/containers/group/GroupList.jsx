"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var colors_1 = require("material-ui/styles/colors");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Avatar_1 = require("material-ui/Avatar");
var renderList = function (props) { return (props.values.map(function (item, i) {
    return (<div key={i}>
            <List_1.ListItem onClick={function () { return props.onSelected(item); }} leftAvatar={(!!item.image) ?
        <Avatar_1.default src={item.image}/> : <Avatar_1.default>{item.name.charAt(0)}</Avatar_1.default>} rightIcon={null} primaryText={item.name} secondaryText={<p>
                        <span style={{ color: colors_1.darkBlack }}>{item.description}</span>
                    </p>}/>
            <Divider_1.default inset={true}/>
        </div>);
})); };
exports.GroupList = function (props) { return (<MuiThemeProvider_1.default>
        <List_1.List>
            {(!!props.values) ? renderList(props) : null}
        </List_1.List>
    </MuiThemeProvider_1.default>); };
