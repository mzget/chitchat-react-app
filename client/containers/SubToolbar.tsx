import * as React from "react";
import FlatButton from 'material-ui/FlatButton';
import { Flex, Box } from "reflexbox";

import * as H from "history";

export const SubToolbar = ({ history, match, onError, chatroomReducer }) => (
    <div>
        <Flex flexColumn={false}>
            <FlatButton label="Manage Group" />
            <FlatButton label="Edit Group Settings" onClick={() => {
                history.push(`/chatroom/settings/${chatroomReducer.room._id}/edit`);
            }} />
        </Flex>
    </div>
);