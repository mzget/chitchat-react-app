import * as React from "react";
import { Flex, Box } from "reflexbox";

import { List, ListItem } from "material-ui/List";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import Avatar from "material-ui/Avatar";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { ContentType } from "../../chats/models/ChatDataModels";
import { MessageImp } from "../../chats/models/MessageImp";
import { CardTextWithAvatar } from "../../components/CardTextWithAvatar";
import { CardImageWithAvatar, CardStickerWithAvatar } from "../../components/CardImageWithAvatar";
import { CardFileWithAvatar } from "../../components/CardFileWithAvatar";
import { CardVideoWithAvatar } from "../../components/CardVideoWithAvatar";
import { IComponentProps } from "../../utils/IComponentProps";

const pdf = require("../../../images/assets/pdf_128.png");

interface MyProps {
    value: Array<MessageImp>;
    onSelected: (item) => void;

    styles?: any;
};

export const ChatBox = (props: MyProps) => (
    <MuiThemeProvider>
        <List style={props.styles} id={"chatbox"}>
            {(!!props.value) ? renderList(props) : null}
        </List>
    </MuiThemeProvider>
);

const renderList = (props: MyProps) => {
    return props.value.map((message, i, arr) => {

        if (!message.user || !message.user.username) {
            console.dir(message);
            return null;
        }

        switch (message.type) {
            case ContentType[ContentType.Text]: {
                return (
                    <ListItem key={i} containerElement={
                        <CardTextWithAvatar
                            title={message.user.username}
                            subtitle={(message.createTime) ? message.createTime.toString() : ""}
                            avatar={(message.user.avatar) ?
                                <Avatar src={message.user.avatar} /> : <Avatar>{message.user.username.charAt(0)}</Avatar>
                            }
                            cardText={message.body} />
                    } >
                    </ListItem >
                );
            }
            case ContentType[ContentType.Sticker]: {
                return (
                    <ListItem key={i} style={{ margin: "5px" }} containerElement={
                        <CardStickerWithAvatar
                            title={message.user.username}
                            subtitle={(message.createTime) ? message.createTime.toString() : ""}
                            avatar={(message.user.avatar) ?
                                <Avatar src={message.user.avatar} /> : <Avatar>{message.user.username.charAt(0)}</Avatar>
                            }
                            imageSrc={message.src} />
                    }>
                    </ListItem>);
            }
            case ContentType[ContentType.Image]: {
                return (
                    <ListItem key={i} style={{ margin: "5px" }} containerElement={
                        <CardImageWithAvatar
                            title={message.user.username}
                            subtitle={(message.createTime) ? message.createTime.toString() : ""}
                            avatar={(message.user.avatar) ?
                                <Avatar src={message.user.avatar} /> : <Avatar>{message.user.username.charAt(0)}</Avatar>
                            }
                            imageSrc={message.src} />
                    }>
                    </ListItem>);
            }
            case ContentType[ContentType.Video]:
                {
                    return (
                        <ListItem key={i} style={{ margin: "5px" }} containerElement={
                            <CardVideoWithAvatar
                                title={message.user.username}
                                subtitle={(message.createTime) ? message.createTime.toString() : ""}
                                avatar={(message.user.avatar) ?
                                    <Avatar src={message.user.avatar} /> : <Avatar>{message.user.username.charAt(0)}</Avatar>
                                }
                                src={message.src} />
                        }>
                        </ListItem>);
                }
            case ContentType[ContentType.File]:
                {
                    return (
                        <ListItem key={i} style={{ margin: "5px" }} containerElement={
                            <CardFileWithAvatar
                                title={message.user.username}
                                subtitle={(message.createTime) ? message.createTime.toString() : ""}
                                avatar={(message.user.avatar) ?
                                    <Avatar src={message.user.avatar} /> : <Avatar>{message.user.username.charAt(0)}</Avatar>
                                }
                                cardText={message.body}
                                imageSrc={pdf} />
                        }>
                        </ListItem>
                    );
                }
            default:
                break;
        }
    });
};
