import * as React from 'react';
import { Flex, Box } from "reflexbox";

import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

import { MemberList } from "../../components/MemberList";
import { AddMemberEnhancer } from "../Enhancers/AddMemberEnhancer";

export interface IAddMembersProps {
    members: Array<any>;
    onselectMember: () => void;
    search: string;
    onTextChanged: (e, value: string) => void;
    onSearch: () => void;
}

export const AddMembers = (props: IAddMembersProps) => (
    <div>
        <Subheader>Add Members</Subheader>
        <Flex>
            <TextField value={props.search} onChange={props.onTextChanged} onKeyDown={(e) => {
                if (e.key == "Enter") props.onSearch();
            }}
                hintText="Enter name or email address"
            />
            <IconButton tooltip="Search" onClick={props.onSearch}>
                <FontIcon className="material-icons" >search</FontIcon>
            </IconButton>
        </Flex>
        <Subheader>Contacts : {(props.members) ? props.members.length : ""}</Subheader>
        <MemberList items={props.members} onSelected={props.onselectMember} />
    </div>
);

export const AddMembersEnhanced = AddMemberEnhancer(({ search, onSearch, onTextChanged, members, onselectMember }: IAddMembersProps) =>
    <AddMembers
        search={search}
        onTextChanged={onTextChanged}
        onSearch={onSearch}
        members={members}
        onselectMember={onselectMember} />
);