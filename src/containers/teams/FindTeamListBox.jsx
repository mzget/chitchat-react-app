"use strict";
var React = require("react");
var Subheader_1 = require("material-ui/Subheader");
var RaisedButton_1 = require("material-ui/RaisedButton");
var style = {
    margin: 4
};
var TeamListView_1 = require("./TeamListView");
exports.FindTeamListBox = function (props) { return (<div>
        <Subheader_1.default>Find Team Results</Subheader_1.default>
        <TeamListView_1.TeamListView items={props.findingTeams} onSelectItem={props.onSelectTeam} actionChild={<RaisedButton_1.default label="Join" primary={true} style={style}/>}/>
    </div>); };
