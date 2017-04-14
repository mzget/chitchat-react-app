"use strict";
const Message_1 = require("../../chitchat/libs/shared/Message");
const MessageImp_1 = require("../../chitchat/chats/models/MessageImp");
const StickerPath_1 = require("../../chitchat/consts/StickerPath");
const configureStore_1 = require("../../redux/configureStore");
function decorateMessage(msg) {
    let { chatroomReducer, userReducer } = configureStore_1.default.getState();
    let message = new MessageImp_1.MessageImp();
    if (msg.image != null) {
        message.body = msg.image;
        message.src = msg.src;
        message.type = Message_1.MessageType[Message_1.MessageType.Image];
    }
    else if (msg.text != null) {
        message.body = msg.text;
        message.type = Message_1.MessageType[Message_1.MessageType.Text];
    }
    else if (msg.location != null) {
        message.type = Message_1.MessageType[Message_1.MessageType.Location];
    }
    else if (msg.video != null) {
        message.body = msg.video;
        message.src = msg.src;
        message.type = Message_1.MessageType[Message_1.MessageType.Video];
    }
    else if (msg.file != null) {
        message.body = msg.file;
        message.meta = { mimetype: msg.mimetype, size: msg.size };
        message.src = msg.src;
        message.type = Message_1.MessageType[Message_1.MessageType.File];
    }
    else if (msg.sticker != null) {
        message.body = msg.sticker;
        message.src = StickerPath_1.imagesPath[msg.sticker].img;
        message.type = Message_1.MessageType[Message_1.MessageType.Sticker];
    }
    message.rid = chatroomReducer.room._id;
    message.sender = userReducer.user._id;
    message.user = {
        _id: userReducer.user._id,
        username: userReducer.user.username,
        avatar: userReducer.user.avatar
    };
    message.target = "*";
    message.uuid = Math.round(Math.random() * 10000); // simulating server-side unique id generation
    message.status = "Sending...";
    return message;
}
exports.decorateMessage = decorateMessage;
