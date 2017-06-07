"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Divider_1 = require("material-ui/Divider");
var colors_1 = require("material-ui/styles/colors");
var IconButton_1 = require("material-ui/IconButton");
var more_vert_1 = require("material-ui/svg-icons/navigation/more-vert");
var IconMenu_1 = require("material-ui/IconMenu");
var MenuItem_1 = require("material-ui/MenuItem");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Avatar_1 = require("material-ui/Avatar");
var BadgeSimple_1 = require("../../components/BadgeSimple");
var iconButtonElement = (<IconButton_1.default touch={true} tooltip="more" tooltipPosition="bottom-left">
        <more_vert_1.default color={colors_1.grey400}/>
    </IconButton_1.default>);
var rightIconMenu = function (log, onRemovedLog) { return (<IconMenu_1.default iconButtonElement={iconButtonElement} onChange={function (event, value) {
    onRemovedLog(log);
}}>
        <MenuItem_1.default value="1" style={{ paddingLeft: "0", paddingRight: "0" }}>Delete</MenuItem_1.default>
    </IconMenu_1.default>); };
var renderList = function (props) { return (props.value.map(function (log, i) {
    return (<div key={i}>
                <List_1.ListItem leftAvatar={(!!log.room.image) ?
        <Avatar_1.default src={log.room.image}/> :
        <Avatar_1.default>{log.roomName.charAt(0)}</Avatar_1.default>} primaryText={<div>
                            {log.roomName}
                        </div>} secondaryText={<div>
                            <span style={{ color: colors_1.darkBlack }}>{log.lastMessage}</span>
                        </div>} onClick={function () { return props.onSelected(log); }} children={<div key={log.id} style={{ float: "right", position: "absolute", top: "10%", right: "2%", margin: "auto" }}>
                            {(log.count && log.count != 0) ? <BadgeSimple_1.default content={log.count}/> : null}
                            {rightIconMenu(log, props.onRemovedLog)}

                        </div>}/>
                <Divider_1.default inset={true}/>
            </div>);
})); };
exports.ListChatLogs = function (props) { return (<MuiThemeProvider_1.default>
        <List_1.List>
            {(!!props.value) ? renderList(props) : null}
        </List_1.List>
    </MuiThemeProvider_1.default>); };
