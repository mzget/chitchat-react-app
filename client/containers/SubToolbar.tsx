import * as React from "react";
import * as Colors from "material-ui/styles/colors";
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Flex, Box } from "reflexbox";

import * as H from "history";

interface ISubToolbar {
    history, match, onError, chatroomReducer
}


const getView = (props: ISubToolbar) => {
    let { match, history, chatroomReducer } = props;

    if (match.path.match("/chatroom/")) {
        return (
            <div style={{ margin: 2, backgroundColor: Colors.indigo50 }}>
                <Flex flexColumn={false}>
                    <RaisedButton label="Manage Group" style={{ margin: 2 }} />
                    <RaisedButton label="Edit Group Settings" style={{ margin: 2 }} onClick={() => {
                        history.push(`/chatroom/settings/${chatroomReducer.room._id}/edit`);
                    }} />
                </Flex>
            </div>
        );
    }
}
export const SubToolbar = (props: ISubToolbar) => (
    <div>
        {
            getView(props)
        }
    </div>
);