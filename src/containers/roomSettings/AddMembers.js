"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var FontIcon_1 = require("material-ui/FontIcon");
var TextField_1 = require("material-ui/TextField");
var Subheader_1 = require("material-ui/Subheader");
var IconButton_1 = require("material-ui/IconButton");
var MemberList_1 = require("../../components/MemberList");
var AddMemberEnhancer_1 = require("../Enhancers/AddMemberEnhancer");
exports.AddMembers = function (props) { return (React.createElement(reflexbox_1.Flex, { align: 'center', flex: true, flexColumn: true },
    React.createElement(Subheader_1["default"], null, "Add Members"),
    React.createElement(reflexbox_1.Flex, null,
        React.createElement(TextField_1["default"], { value: props.search, onChange: props.onTextChanged, onKeyDown: function (e) {
                if (e.key == "Enter")
                    props.onSearch();
            }, hintText: "Enter name or email address" }),
        React.createElement(IconButton_1["default"], { tooltip: "Search", onClick: props.onSearch },
            React.createElement(FontIcon_1["default"], { className: "material-icons" }, "search"))),
    React.createElement(Subheader_1["default"], null,
        "Contacts : ",
        (props.members) ? props.members.length : ""),
    React.createElement(MemberList_1.MemberList, { items: props.members, onAdded: props.onAddMember }))); };
exports.AddMembersEnhanced = AddMemberEnhancer_1.AddMemberEnhancer(function (_a) {
    var search = _a.search, onSearch = _a.onSearch, onTextChanged = _a.onTextChanged, members = _a.members, onAddMember = _a.onAddMember, match = _a.match;
    return React.createElement(exports.AddMembers, { search: search, onTextChanged: onTextChanged, onSearch: onSearch, members: members, onAddMember: onAddMember });
});
