"use strict";
var React = require("react");
var Subheader_1 = require("material-ui/Subheader");
var RaisedButton_1 = require("material-ui/RaisedButton");
var style = {
    margin: 6
};
var TeamListView_1 = require("./TeamListView");
var IComponentNameProps = (function () {
    function IComponentNameProps() {
    }
    return IComponentNameProps;
}());
exports.TeamListBox = function (props) { return (<div>
        <Subheader_1.default>Your Teams</Subheader_1.default>
        <TeamListView_1.TeamListView items={props.teams} onSelectItem={props.onSelectTeam} actionChild={<RaisedButton_1.default label="Enter" primary={true} style={style}/>}/>
    </div>); };
