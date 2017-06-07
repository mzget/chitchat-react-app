"use strict";
var React = require("react");
var Subheader_1 = require("material-ui/Subheader");
var GroupList_1 = require("./GroupList");
exports.GroupListView = function (props) { return (<div>
        <Subheader_1.default>{props.subHeader}</Subheader_1.default>
        <GroupList_1.GroupList values={props.groups} onSelected={props.onselectGroup}/>
    </div>); };
