import * as React from 'react';
import { Flex, Box } from "reflexbox";

import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

export const AddMembers = () => (
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
    </div>
);