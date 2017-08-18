import { MessageType } from "../../chitchat/shared/Message";
import { MessageImp } from "../../chitchat/chats/models/MessageImp";
import { imagesPath } from "../../chitchat/consts/StickerPath";
import Store from "../../redux/configureStore";
export function decorateMessage(msg) {
    let { chatroomReducer } = Store.getState();
    let { userReducer } = Store.getState();
    let message = new MessageImp();
    if (msg.image != null) {
        message.body = msg.image;
        message.src = msg.src;
        message.type = MessageType[MessageType.Image];
    }
    else if (msg.text != null) {
        message.body = msg.text;
        message.type = MessageType[MessageType.Text];
    }
    else if (msg.position != null) {
        message.body = msg.position;
        message.type = MessageType[MessageType.Location];
    }
    else if (msg.video != null) {
        message.body = msg.video;
        message.src = msg.src;
        message.type = MessageType[MessageType.Video];
    }
    else if (msg.file != null) {
        message.body = msg.file;
        message.meta = { mimetype: msg.mimetype, size: msg.size };
        message.src = msg.src;
        message.type = MessageType[MessageType.File];
    }
    else if (msg.sticker != null) {
        message.body = msg.sticker;
        message.src = imagesPath[msg.sticker].img;
        message.type = MessageType[MessageType.Sticker];
    }
    else {
        throw new Error("What the fuck!");
    }
    message.rid = chatroomReducer.get("room")._id;
    message.sender = userReducer.user._id;
    message.user = {
        _id: userReducer.user._id,
        username: userReducer.user.username,
        avatar: userReducer.user.avatar
    };
    message.target = chatroomReducer.get("chatTargets");
    message.uuid = Math.round(Math.random() * 10000);
    message.status = "Sending...";
    return message;
}
