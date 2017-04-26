import * as React from 'react';
import { Flex, Box } from "reflexbox";

import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

import { MemberList } from "../../components/MemberList";

interface IAddMembers {
    members: Array<any>;
    onselectMember: () => void;
}

export const AddMembers = (props: IAddMembers) => (
    <div>
        <Subheader>Add Members</Subheader>
        <Flex>
            <TextField
                hintText="Enter name or email address"
            />
            <IconButton tooltip="Search">
                <FontIcon className="material-icons" >search</FontIcon>
            </IconButton>
        </Flex>
        <Subheader>Contacts</Subheader>
        <MemberList items={props.members} onSelected={props.onselectMember} />
    </div>
);