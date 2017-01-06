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
import Avatar from 'material-ui/Avatar';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { ContentType } from "../chats/models/ChatDataModels";
import { MessageImp } from "../chats/models/MessageImp";
import CardTextWithAvatar from '../components/CardTextWithAvatar';
import CardImageWithAvatar from '../components/CardImageWithAvatar';
import CardVideoWithAvatar from '../components/CardVideoWithAvatar';

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
        return this.props.value.map((message, i, arr) => {

            if (!message.user || !message.user.username) {
                console.dir(message);
                return null;
            }

            switch (message.type) {
                case ContentType[ContentType.Text]:
                    {
                        return (
                            <div key={i}>
                                <CardTextWithAvatar
                                    title={message.user.username}
                                    subtitle={(message.createTime) ? message.createTime.toString() : ''}
                                    avatar={(message.user.avatar) ?
                                        <Avatar src={message.user.avatar} /> : <Avatar>{message.user.username.charAt(0)}</Avatar>
                                    }
                                    cardText={message.body} />
                            </div>);
                    }
                case ContentType[ContentType.Image]:
                    {
                        return (
                            <div key={i}>
                                <CardImageWithAvatar
                                    title={message.user.username}
                                    subtitle={(message.createTime) ? message.createTime.toString() : ''}
                                    avatar={(message.user.avatar) ?
                                        <Avatar src={message.user.avatar} /> : <Avatar>{message.user.username.charAt(0)}</Avatar>
                                    }
                                    imageSrc={message.src} />
                            </div>);
                    }
                case ContentType[ContentType.Video]:
                    {
                        return (
                            <div key={i}>
                                <CardVideoWithAvatar
                                    title={message.user.username}
                                    subtitle={(message.createTime) ? message.createTime.toString() : ''}
                                    avatar={(message.user.avatar) ?
                                        <Avatar src={message.user.avatar} /> : <Avatar>{message.user.username.charAt(0)}</Avatar>
                                    }
                                    src={message.src} />
                            </div>);
                    }
                default:
                    break;
            }
        });
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
