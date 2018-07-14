import * as React from "react";
import { white, green50 } from "material-ui/styles/colors";
import { List, ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { MessageType } from "stalk-js/starter/models";
import { CardTextWithAvatar } from "../../components/CardTextWithAvatar";
import { CardImageWithAvatar, CardStickerWithAvatar } from "../../components/CardImageWithAvatar";
import { CardFileWithAvatar } from "../../components/CardFileWithAvatar";
import { CardVideoWithAvatar } from "../../components/CardVideoWithAvatar";
import { CardMapWithAvatar } from "../../components/Cards/CardMapWithAvatar";
import configureStore from "../../redux/configureStore";
const FontAwesome = require("react-fontawesome");
;
export const ChatBox = (props) => (<MuiThemeProvider>
        <List style={props.styles} id={"chatbox"}>
            {(!!props.value) ? renderList(props) : null}
        </List>
    </MuiThemeProvider>);
export const getFontIcon = (message) => {
    if (message.type == MessageType[MessageType.File]) {
        let exts = message.body.split(".");
        let ext = exts[exts.length - 1].toLowerCase();
        if (ext == "pdf")
            return <FontAwesome style={{ padding: 5, marginLeft: 5 }} name="file-pdf-o" size="3x"/>;
        else if (ext == "txt" || ext == "json")
            return <FontAwesome style={{ padding: 5, marginLeft: 5 }} name="file-text-o" size="3x"/>;
        else if (ext == "html")
            return <FontAwesome style={{ padding: 5, marginLeft: 5 }} name="code" size="3x"/>;
        else if (ext == "pptx")
            return <FontAwesome style={{ padding: 5, marginLeft: 5 }} name="file-powerpoint-o" size="3x"/>;
        else if (ext == "xlsx" || ext == "xls")
            return <FontAwesome style={{ padding: 5, marginLeft: 5 }} name="file-excel-o" size="3x"/>;
        else if (ext == "docx" || ext == "doc")
            return <FontAwesome style={{ padding: 5, marginLeft: 5 }} name="file-word-o" size="3x"/>;
        else
            return <FontAwesome style={{ padding: 5, marginLeft: 5 }} name="file-o" size="3x"/>;
    }
};
const isMyMessage = (message) => {
    let _store = configureStore;
    if (!!_store.getState().userReducer.user && _store.getState().userReducer.user._id == message.sender) {
        return true;
    }
    else
        return false;
};
const setUpDateTime = (data) => {
    return `${data.toLocaleTimeString()} : ${data.toLocaleDateString()} `;
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
        if (!!_store.getState().userReducer.user && _store.getState().userReducer.user._id != message.sender) {
            delete message.readers;
        }
        if (!!message.createTime) {
            let d = new Date(message.createTime.toLocaleString());
            message.createTime = setUpDateTime(d);
        }
        switch (message.type) {
            case MessageType[MessageType.Text]: {
                return (<ListItem key={i} containerElement={<CardTextWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                    <Avatar src={message.user.avatar}/> : <Avatar>{message.user.username.charAt(0)}</Avatar>} cardText={message.body} readers={(!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null} onClickReader={() => onClickReader(message)} bg_color={(isMyMessage(message)) ? green50 : white}/>}>
                    </ListItem>);
            }
            case MessageType[MessageType.Sticker]: {
                return (<ListItem key={i} containerElement={<CardStickerWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                    <Avatar src={message.user.avatar}/> : <Avatar>{message.user.username.charAt(0)}</Avatar>} imageSrc={message.src} readers={(!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null} onClickReader={() => onClickReader(message)} bg_color={(isMyMessage(message)) ? green50 : white}/>}>
                    </ListItem>);
            }
            case MessageType[MessageType.Image]: {
                return (<ListItem key={i} containerElement={<CardImageWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                    <Avatar src={message.user.avatar}/> : <Avatar>{message.user.username.charAt(0)}</Avatar>} cardText={message.body} imageSrc={message.src} readers={(!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null} onClickReader={() => onClickReader(message)} bg_color={(isMyMessage(message)) ? green50 : white}/>}>
                    </ListItem>);
            }
            case MessageType[MessageType.Video]:
                {
                    return (<ListItem key={i} containerElement={<CardVideoWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                        <Avatar src={message.user.avatar}/> : <Avatar>{message.user.username.charAt(0)}</Avatar>} cardText={message.body} src={message.src} readers={(!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null} onClickReader={() => onClickReader(message)} bg_color={(isMyMessage(message)) ? green50 : white}/>}>
                        </ListItem>);
                }
            case MessageType[MessageType.File]:
                {
                    return (<ListItem key={i} containerElement={<CardFileWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                        <Avatar src={message.user.avatar}/> :
                        <Avatar>{message.user.username.charAt(0)}</Avatar>} cardText={message.body} fileIcon={getFontIcon(message)} openAction={() => {
                        window.open(message.src, "_blank");
                    }} readers={(!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null} onClickReader={() => onClickReader(message)} bg_color={(isMyMessage(message)) ? green50 : white}/>}>
                        </ListItem>);
                }
            case MessageType[MessageType.Location]:
                {
                    return (<ListItem key={i} containerElement={<CardMapWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                        <Avatar src={message.user.avatar}/> :
                        <Avatar>{message.user.username.charAt(0)}</Avatar>} content={{ position: message.body }} readers={(!!message.readers && message.readers.length > 0) ? `Read ${message.readers.length}` : null} onClickReader={() => onClickReader(message)} bg_color={(isMyMessage(message)) ? green50 : white}/>}>
                        </ListItem>);
                }
            default:
                break;
        }
    });
};
