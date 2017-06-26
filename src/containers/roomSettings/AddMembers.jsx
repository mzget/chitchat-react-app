import * as React from 'react';
import Flexbox from "flexbox-react";
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import { MemberList } from "../../components/MemberList";
import { AddMemberEnhancer } from "../Enhancers/AddMemberEnhancer";
export const AddMembers = (props) => (<Flexbox flexDirection={"column"} alignItems='center'>
        <Subheader>Add Members</Subheader>
        <Flexbox>
            <TextField value={props.search} onChange={props.onTextChanged} onKeyDown={(e) => {
    if (e.key == "Enter")
        props.onSearch();
}} hintText="Enter name or email address"/>
            <IconButton tooltip="Search" onClick={props.onSearch}>
                <FontIcon className="material-icons">search</FontIcon>
            </IconButton>
        </Flexbox>
        <Subheader>Contacts : {(props.members) ? props.members.length : ""}</Subheader>
        <MemberList items={props.members} onAdded={props.onAddMember}/>
    </Flexbox>);
export const AddMembersEnhanced = AddMemberEnhancer(({ search, onSearch, onTextChanged, members, onAddMember, match }) => <AddMembers search={search} onTextChanged={onTextChanged} onSearch={onSearch} members={members} onAddMember={onAddMember}/>);
