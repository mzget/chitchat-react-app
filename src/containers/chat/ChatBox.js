import * as React from "react";
const FontAwesome = require("react-fontawesome");
import { List, ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { MessageType } from "../../chitchat/shared/Message";
import { CardTextWithAvatar } from "../../components/CardTextWithAvatar";
import { CardImageWithAvatar, CardStickerWithAvatar } from "../../components/CardImageWithAvatar";
import { CardFileWithAvatar } from "../../components/CardFileWithAvatar";
import { CardVideoWithAvatar } from "../../components/CardVideoWithAvatar";
import { CardMapWithAvatar } from "../../components/Cards/CardMapWithAvatar";
import configureStore from "../../redux/configureStore";
;
export const ChatBox = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(List, { style: props.styles, id: "chatbox" }, (!!props.value) ? renderList(props) : null)));
export const getFontIcon = (message) => {
    if (message.type == MessageType[MessageType.File]) {
        let exts = message.body.split(".");
        let ext = exts[exts.length - 1].toLowerCase();
        if (ext == "pdf")
            return React.createElement(FontAwesome, { style: { padding: 5, marginLeft: 5 }, name: "file-pdf-o", size: "3x" });
        else if (ext == "txt" || ext == "json")
            return React.createElement(FontAwesome, { style: { padding: 5, marginLeft: 5 }, name: "file-text-o", size: "3x" });
        else if (ext == "html")
            return React.createElement(FontAwesome, { style: { padding: 5, marginLeft: 5 }, name: "code", size: "3x" });
        else if (ext == "pptx")
            return React.createElement(FontAwesome, { style: { padding: 5, marginLeft: 5 }, name: "file-powerpoint-o", size: "3x" });
        else if (ext == "xlsx" || ext == "xls")
            return React.createElement(FontAwesome, { style: { padding: 5, marginLeft: 5 }, name: "file-excel-o", size: "3x" });
        else if (ext == "docx" || ext == "doc")
            return React.createElement(FontAwesome, { style: { padding: 5, marginLeft: 5 }, name: "file-word-o", size: "3x" });
        else
            return React.createElement(FontAwesome, { style: { padding: 5, marginLeft: 5 }, name: "file-o", size: "3x" });
    }
};
const onClickReader = (message) => {
    console.log(message);
};
const renderList = (props) => {
    let _store = configureStore;
    return props.value.map((message, i, arr) => {
        if (!message.user || !message.user.username) {
            console.warn(message);
            return null;
        }
        if (_store.getState().userReducer.user._id != message.sender) {
            delete message.readers;
        }
        switch (message.type) {
            case MessageType[MessageType.Text]: {
                return (React.createElement(ListItem, { key: i, containerElement: React.createElement(CardTextWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                            React.createElement(Avatar, { src: message.user.avatar }) : React.createElement(Avatar, null, message.user.username.charAt(0)), cardText: message.body, readers: (!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null, onClickReader: () => onClickReader(message) }) }));
            }
            case MessageType[MessageType.Sticker]: {
                return (React.createElement(ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardStickerWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                            React.createElement(Avatar, { src: message.user.avatar }) : React.createElement(Avatar, null, message.user.username.charAt(0)), imageSrc: message.src, readers: (!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null, onClickReader: () => onClickReader(message) }) }));
            }
            case MessageType[MessageType.Image]: {
                return (React.createElement(ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardImageWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                            React.createElement(Avatar, { src: message.user.avatar }) : React.createElement(Avatar, null, message.user.username.charAt(0)), imageSrc: message.src, readers: (!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null, onClickReader: () => onClickReader(message) }) }));
            }
            case MessageType[MessageType.Video]:
                {
                    return (React.createElement(ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardVideoWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                                React.createElement(Avatar, { src: message.user.avatar }) : React.createElement(Avatar, null, message.user.username.charAt(0)), src: message.src, readers: (!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null, onClickReader: () => onClickReader(message) }) }));
                }
            case MessageType[MessageType.File]:
                {
                    return (React.createElement(ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardFileWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                                React.createElement(Avatar, { src: message.user.avatar }) :
                                React.createElement(Avatar, null, message.user.username.charAt(0)), cardText: message.body, fileIcon: getFontIcon(message), openAction: () => {
                                window.open(message.src, "_blank");
                            }, readers: (!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null, onClickReader: () => onClickReader(message) }) }));
                }
            case MessageType[MessageType.Location]:
                {
                    return (React.createElement(ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardMapWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                                React.createElement(Avatar, { src: message.user.avatar }) :
                                React.createElement(Avatar, null, message.user.username.charAt(0)), content: { position: message.body }, readers: (!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null, onClickReader: () => onClickReader(message) }) }));
                }
            default:
                break;
        }
    });
};
