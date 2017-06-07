"use strict";
var React = require("react");
var List_1 = require("material-ui/List");
var Avatar_1 = require("material-ui/Avatar");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Message_1 = require("../../chitchat/shared/Message");
var CardTextWithAvatar_1 = require("../../components/CardTextWithAvatar");
var CardImageWithAvatar_1 = require("../../components/CardImageWithAvatar");
var CardFileWithAvatar_1 = require("../../components/CardFileWithAvatar");
var CardVideoWithAvatar_1 = require("../../components/CardVideoWithAvatar");
var FontAwesome = require("react-fontawesome");
;
exports.getFontIcon = function (message) {
    var exts = message.body.split(".");
    var ext = exts[exts.length - 1].toLowerCase();
    if (message.type == Message_1.MessageType[Message_1.MessageType.File]) {
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
exports.ChatBox = function (props) { return (<MuiThemeProvider_1.default>
        <List_1.List style={props.styles} id={"chatbox"}>
            {(!!props.value) ? renderList(props) : null}
        </List_1.List>
    </MuiThemeProvider_1.default>); };
var renderList = function (props) {
    return props.value.map(function (message, i, arr) {
        if (!message.user || !message.user.username) {
            console.warn(message);
            return null;
        }
        switch (message.type) {
            case Message_1.MessageType[Message_1.MessageType.Text]: {
                return (<List_1.ListItem key={i} containerElement={<CardTextWithAvatar_1.CardTextWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                    <Avatar_1.default src={message.user.avatar}/> : <Avatar_1.default>{message.user.username.charAt(0)}</Avatar_1.default>} cardText={message.body}/>}>
                    </List_1.ListItem>);
            }
            case Message_1.MessageType[Message_1.MessageType.Sticker]: {
                return (<List_1.ListItem key={i} style={{ margin: "5px" }} containerElement={<CardImageWithAvatar_1.CardStickerWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                    <Avatar_1.default src={message.user.avatar}/> : <Avatar_1.default>{message.user.username.charAt(0)}</Avatar_1.default>} imageSrc={message.src}/>}>
                    </List_1.ListItem>);
            }
            case Message_1.MessageType[Message_1.MessageType.Image]: {
                return (<List_1.ListItem key={i} style={{ margin: "5px" }} containerElement={<CardImageWithAvatar_1.CardImageWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                    <Avatar_1.default src={message.user.avatar}/> : <Avatar_1.default>{message.user.username.charAt(0)}</Avatar_1.default>} imageSrc={message.src}/>}>
                    </List_1.ListItem>);
            }
            case Message_1.MessageType[Message_1.MessageType.Video]:
                {
                    return (<List_1.ListItem key={i} style={{ margin: "5px" }} containerElement={<CardVideoWithAvatar_1.CardVideoWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                        <Avatar_1.default src={message.user.avatar}/> : <Avatar_1.default>{message.user.username.charAt(0)}</Avatar_1.default>} src={message.src}/>}>
                        </List_1.ListItem>);
                }
            case Message_1.MessageType[Message_1.MessageType.File]:
                {
                    return (<List_1.ListItem key={i} style={{ margin: "5px" }} containerElement={<CardFileWithAvatar_1.CardFileWithAvatar title={message.user.username} subtitle={(message.createTime) ? message.createTime.toString() : ""} avatar={(message.user.avatar) ?
                        <Avatar_1.default src={message.user.avatar}/> :
                        <Avatar_1.default>{message.user.username.charAt(0)}</Avatar_1.default>} cardText={message.body} fileIcon={exports.getFontIcon(message)} openAction={function () {
                        window.open(message.src, "_blank");
                    }}/>}>
                        </List_1.ListItem>);
                }
            default:
                break;
        }
    });
};
