import * as React from 'react';
import { Flex, Box } from 'reflexbox';

import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { MessageImp } from "../chats/models/MessageImp";
import { IncomingList, OutComingList } from '../components/MessageListItem';

import { IComponentProps } from '../utils/IComponentProps';

abstract class MyProps implements IComponentProps {
    location: {
        query: {
            contactId: string;
            userId: string;
            roomId: string;
            username: string;
        }
    };
    params;
    router;
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
    value: Array<MessageImp>;
    onSelected: (item) => void;
};

interface IComponentNameState { };

class ChatBox extends React.Component<MyProps, IComponentNameState> {
    componentWillMount() {
        this.state = {};
    }

    renderList = () => {
        let { userReducer } = this.props;
        return this.props.value.map((message, i) => (
            <div key={i}>
                {
                    (message.sender != this.props.userReducer.user._id) ?
                        <IncomingList onSelected={this.props.onSelected} message={message} /> :
                        <Flex justify='flex-end'>
                            <OutComingList onSelected={this.props.onSelected} message={message} />
                        </Flex>
                }
                <Divider inset={true} />
            </div>
        ));
    }

    public render(): JSX.Element {
        return (
            < MuiThemeProvider >
                <List>
                    {(!!this.props.value) ? this.renderList() : null}
                </List>
            </ MuiThemeProvider >);
    }
}

export default ChatBox;
