import * as React from "react";
import * as Colors from "material-ui/styles/colors";
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Flex, Box } from "reflexbox";

import * as H from "history";

export const SubToolbar = ({ history, match, onError, chatroomReducer }) => (
    <div style={{margin:2, backgroundColor: Colors.indigo50}}>
        <Flex flexColumn={false}>
            <RaisedButton label="Manage Group" style={{margin:2}}/>
            <RaisedButton label="Edit Group Settings" style={{margin:2}} onClick={() => {
                history.push(`/chatroom/settings/${chatroomReducer.room._id}/edit`);
            }} />
        </Flex>
    </div>
);