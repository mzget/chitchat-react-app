"use strict";
var React = require("react");
var FontAwesome = require("react-fontawesome");
var List_1 = require("material-ui/List");
var Avatar_1 = require("material-ui/Avatar");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Message_1 = require("../../chitchat/shared/Message");
var CardTextWithAvatar_1 = require("../../components/CardTextWithAvatar");
var CardImageWithAvatar_1 = require("../../components/CardImageWithAvatar");
var CardFileWithAvatar_1 = require("../../components/CardFileWithAvatar");
var CardVideoWithAvatar_1 = require("../../components/CardVideoWithAvatar");
var configureStore_1 = require("../../redux/configureStore");
;
exports.ChatBox = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement(List_1.List, { style: props.styles, id: "chatbox" }, (!!props.value) ? renderList(props) : null))); };
exports.getFontIcon = function (message) {
    if (message.type == Message_1.MessageType[Message_1.MessageType.File]) {
        var exts = message.body.split(".");
        var ext = exts[exts.length - 1].toLowerCase();
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
var onClickReader = function (message) {
    console.log(message);
};
var renderList = function (props) {
    var _store = configureStore_1["default"];
    return props.value.map(function (message, i, arr) {
        if (!message.user || !message.user.username) {
            console.warn(message);
            return null;
        }
        if (_store.getState().userReducer.user._id != message.sender) {
            delete message.readers;
        }
        switch (message.type) {
            case Message_1.MessageType[Message_1.MessageType.Text]: {
                return (React.createElement(List_1.ListItem, { key: i, containerElement: React.createElement(CardTextWithAvatar_1.CardTextWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                            React.createElement(Avatar_1["default"], { src: message.user.avatar }) : React.createElement(Avatar_1["default"], null, message.user.username.charAt(0)), cardText: message.body, readers: (!!message.readers && message.readers.length > 0) ? "Read " + message.readers.length : null, onClickReader: function () { return onClickReader(message); } }) }));
            }
            case Message_1.MessageType[Message_1.MessageType.Sticker]: {
                return (React.createElement(List_1.ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardImageWithAvatar_1.CardStickerWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                            React.createElement(Avatar_1["default"], { src: message.user.avatar }) : React.createElement(Avatar_1["default"], null, message.user.username.charAt(0)), imageSrc: message.src, readers: (!!message.readers && message.readers.length > 0) ? "Read " + message.readers.length : null, onClickReader: function () { return onClickReader(message); } }) }));
            }
            case Message_1.MessageType[Message_1.MessageType.Image]: {
                return (React.createElement(List_1.ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardImageWithAvatar_1.CardImageWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                            React.createElement(Avatar_1["default"], { src: message.user.avatar }) : React.createElement(Avatar_1["default"], null, message.user.username.charAt(0)), imageSrc: message.src, readers: (!!message.readers && message.readers.length > 0) ? "Read " + message.readers.length : null, onClickReader: function () { return onClickReader(message); } }) }));
            }
            case Message_1.MessageType[Message_1.MessageType.Video]:
                {
                    return (React.createElement(List_1.ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardVideoWithAvatar_1.CardVideoWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                                React.createElement(Avatar_1["default"], { src: message.user.avatar }) : React.createElement(Avatar_1["default"], null, message.user.username.charAt(0)), src: message.src, readers: (!!message.readers && message.readers.length > 0) ? "Read " + message.readers.length : null, onClickReader: function () { return onClickReader(message); } }) }));
                }
            case Message_1.MessageType[Message_1.MessageType.File]:
                {
                    return (React.createElement(List_1.ListItem, { key: i, style: { margin: "5px" }, containerElement: React.createElement(CardFileWithAvatar_1.CardFileWithAvatar, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : "", avatar: (message.user.avatar) ?
                                React.createElement(Avatar_1["default"], { src: message.user.avatar }) :
                                React.createElement(Avatar_1["default"], null, message.user.username.charAt(0)), cardText: message.body, fileIcon: exports.getFontIcon(message), openAction: function () {
                                window.open(message.src, "_blank");
                            }, readers: (!!message.readers && message.readers.length > 0) ? "Read " + message.readers.length : null, onClickReader: function () { return onClickReader(message); } }) }));
                }
            default:
                break;
        }
    });
};
