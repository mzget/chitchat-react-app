"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var FontIcon_1 = require("material-ui/FontIcon");
var TextField_1 = require("material-ui/TextField");
var Subheader_1 = require("material-ui/Subheader");
var IconButton_1 = require("material-ui/IconButton");
var MemberList_1 = require("../../components/MemberList");
var AddMemberEnhancer_1 = require("../Enhancers/AddMemberEnhancer");
exports.AddMembers = function (props) { return (<reflexbox_1.Flex align='center' flex flexColumn>
        <Subheader_1.default>Add Members</Subheader_1.default>
        <reflexbox_1.Flex>
            <TextField_1.default value={props.search} onChange={props.onTextChanged} onKeyDown={function (e) {
    if (e.key == "Enter")
        props.onSearch();
}} hintText="Enter name or email address"/>
            <IconButton_1.default tooltip="Search" onClick={props.onSearch}>
                <FontIcon_1.default className="material-icons">search</FontIcon_1.default>
            </IconButton_1.default>
        </reflexbox_1.Flex>
        <Subheader_1.default>Contacts : {(props.members) ? props.members.length : ""}</Subheader_1.default>
        <MemberList_1.MemberList items={props.members} onAdded={props.onAddMember}/>
    </reflexbox_1.Flex>); };
exports.AddMembersEnhanced = AddMemberEnhancer_1.AddMemberEnhancer(function (_a) {
    var search = _a.search, onSearch = _a.onSearch, onTextChanged = _a.onTextChanged, members = _a.members, onAddMember = _a.onAddMember, match = _a.match;
    return <exports.AddMembers search={search} onTextChanged={onTextChanged} onSearch={onSearch} members={members} onAddMember={onAddMember}/>;
});
