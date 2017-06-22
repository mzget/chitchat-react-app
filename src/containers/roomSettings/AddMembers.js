import * as React from 'react';
import { Flex } from "reflexbox";
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import { MemberList } from "../../components/MemberList";
import { AddMemberEnhancer } from "../Enhancers/AddMemberEnhancer";
export const AddMembers = (props) => (React.createElement(Flex, { align: 'center', flex: true, flexColumn: true },
    React.createElement(Subheader, null, "Add Members"),
    React.createElement(Flex, null,
        React.createElement(TextField, { value: props.search, onChange: props.onTextChanged, onKeyDown: (e) => {
                if (e.key == "Enter")
                    props.onSearch();
            }, hintText: "Enter name or email address" }),
        React.createElement(IconButton, { tooltip: "Search", onClick: props.onSearch },
            React.createElement(FontIcon, { className: "material-icons" }, "search"))),
    React.createElement(Subheader, null,
        "Contacts : ",
        (props.members) ? props.members.length : ""),
    React.createElement(MemberList, { items: props.members, onAdded: props.onAddMember })));
export const AddMembersEnhanced = AddMemberEnhancer(({ search, onSearch, onTextChanged, members, onAddMember, match }) => React.createElement(AddMembers, { search: search, onTextChanged: onTextChanged, onSearch: onSearch, members: members, onAddMember: onAddMember }));
