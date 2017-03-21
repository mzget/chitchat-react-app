"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const List_1 = require("material-ui/List");
const Avatar_1 = require("material-ui/Avatar");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const ChatDataModels_1 = require("../../chats/models/ChatDataModels");
const CardTextWithAvatar_1 = require("../../components/CardTextWithAvatar");
const CardImageWithAvatar_1 = require("../../components/CardImageWithAvatar");
const CardFileWithAvatar_1 = require("../../components/CardFileWithAvatar");
const CardVideoWithAvatar_1 = require("../../components/CardVideoWithAvatar");
const FontAwesome = require("react-fontawesome");
;
exports.getFontIcon = (message) => {
    let exts = message.body.split(".");
    let ext = exts[exts.length - 1].toLowerCase();
    if (message.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.File]) {
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
exports.ChatBox = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(List_1.List, { style: props.styles, id: "chatbox" }, (!!props.value) ? renderList(props) : null)));
const renderList = (props) => {
    return props.value.map((message, i, arr) => {
        if (!message.user || !message.user.username) {
            console.warn(message);
            return null;
        }
        switch (message.type) {
            case ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]: {
                return (React.createElement(List_1.ListItem, { key: i, containerElement: React.createElement(CardTextWithAvatar_1.CardTextWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                            React.createElement(Avatar_1.default, { src: message.user.avatar }) : React.createElement(Avatar_1.default, null, message.user.username.charAt(0)), cardText: message.body }) }));
            }
            case ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Sticker]: {
                return (React.createElement(List_1.ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardImageWithAvatar_1.CardStickerWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                            React.createElement(Avatar_1.default, { src: message.user.avatar }) : React.createElement(Avatar_1.default, null, message.user.username.charAt(0)), imageSrc: message.src }) }));
            }
            case ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Image]: {
                return (React.createElement(List_1.ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardImageWithAvatar_1.CardImageWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                            React.createElement(Avatar_1.default, { src: message.user.avatar }) : React.createElement(Avatar_1.default, null, message.user.username.charAt(0)), imageSrc: message.src }) }));
            }
            case ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Video]:
                {
                    return (React.createElement(List_1.ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardVideoWithAvatar_1.CardVideoWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                                React.createElement(Avatar_1.default, { src: message.user.avatar }) : React.createElement(Avatar_1.default, null, message.user.username.charAt(0)), src: message.src }) }));
                }
            case ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.File]:
                {
                    return (React.createElement(List_1.ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardFileWithAvatar_1.CardFileWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                                React.createElement(Avatar_1.default, { src: message.user.avatar }) :
                                React.createElement(Avatar_1.default, null, message.user.username.charAt(0)), cardText: message.body, fileIcon: exports.getFontIcon(message), openAction: () => {
                                window.open(message.src, "_blank");
                            } }) }));
                }
            default:
                break;
        }
    });
};
