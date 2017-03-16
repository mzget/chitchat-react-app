"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const OrgGroupListView_1 = require("./OrgGroupListView");
const GroupListEnhancer_1 = require("./GroupListEnhancer");
const bobo = GroupListEnhancer_1.GroupListEnhancer(({ groupReducer, fetchGroup, onselectGroup }) => React.createElement(OrgGroupListView_1.OrgGroupListView, { orgGroups: groupReducer.orgGroups, onselectGroup: onselectGroup }));
const mapStateToProps = (state) => ({ groupReducer: state.groupReducer });
exports.ConnectGroupListEnhancer = react_redux_1.connect(mapStateToProps)(bobo);
