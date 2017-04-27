"use strict";
const React = require("react");
const reflexbox_1 = require("reflexbox");
const FontIcon_1 = require("material-ui/FontIcon");
const TextField_1 = require("material-ui/TextField");
const Subheader_1 = require("material-ui/Subheader");
const IconButton_1 = require("material-ui/IconButton");
const MemberList_1 = require("../../components/MemberList");
const AddMemberEnhancer_1 = require("../Enhancers/AddMemberEnhancer");
exports.AddMembers = (props) => (React.createElement(reflexbox_1.Flex, { align: 'center', flex: true, flexColumn: true },
    React.createElement(Subheader_1.default, null, "Add Members"),
    React.createElement(reflexbox_1.Flex, null,
        React.createElement(TextField_1.default, { value: props.search, onChange: props.onTextChanged, onKeyDown: (e) => {
                if (e.key == "Enter")
                    props.onSearch();
            }, hintText: "Enter name or email address" }),
        React.createElement(IconButton_1.default, { tooltip: "Search", onClick: props.onSearch },
            React.createElement(FontIcon_1.default, { className: "material-icons" }, "search"))),
    React.createElement(Subheader_1.default, null,
        "Contacts : ",
        (props.members) ? props.members.length : ""),
    React.createElement(MemberList_1.MemberList, { items: props.members, onAdded: props.onAddMember })));
exports.AddMembersEnhanced = AddMemberEnhancer_1.AddMemberEnhancer(({ search, onSearch, onTextChanged, members, onAddMember }) => React.createElement(exports.AddMembers, { search: search, onTextChanged: onTextChanged, onSearch: onSearch, members: members, onAddMember: onAddMember }));
