"use strict";
var React = require("react");
var react_redux_1 = require("react-redux");
var GroupListView_1 = require("./GroupListView");
var GroupListEnhancer_1 = require("./GroupListEnhancer");
var bobo = GroupListEnhancer_1.GroupListEnhancer(function (_a) {
    var groups = _a.groups, fetchGroup = _a.fetchGroup, onselectGroup = _a.onselectGroup, subHeader = _a.subHeader;
    return <GroupListView_1.GroupListView groups={groups} onselectGroup={onselectGroup} subHeader={subHeader}/>;
});
exports.ConnectGroupListEnhancer = react_redux_1.connect()(bobo);
