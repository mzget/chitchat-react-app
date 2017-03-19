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
const pdf = require("../../../images/assets/pdf_128.png");
;
exports.ChatBox = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(List_1.List, { style: props.styles, id: "chatbox" }, (!!props.value) ? renderList(props) : null)));
const renderList = (props) => {
    return props.value.map((message, i, arr) => {
        if (!message.user || !message.user.username) {
            console.dir(message);
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
                                React.createElement(Avatar_1.default, { src: message.user.avatar }) : React.createElement(Avatar_1.default, null, message.user.username.charAt(0)), cardText: message.body, imageSrc: pdf, openAction: () => {
                                window.open(message.src, "_blank");
                            } }) }));
                }
            default:
                break;
        }
    });
};