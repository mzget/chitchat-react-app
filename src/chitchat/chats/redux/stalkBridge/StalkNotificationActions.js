import { BackendFactory } from "../../BackendFactory";
import * as CryptoHelper from "../../utils/CryptoHelper";
import { MessageType } from "../../../shared/Message";
import { ChitChatFactory } from "../../ChitChatFactory";
const getStore = () => ChitChatFactory.getInstance().store;
export const STALK_NOTICE_NEW_MESSAGE = "STALK_NOTICE_NEW_MESSAGE";
const stalkNotiNewMessage = (payload) => ({ type: STALK_NOTICE_NEW_MESSAGE, payload });
const init = (onSuccess) => {
    console.log("Initialize NotificationManager.");
};
export const regisNotifyNewMessageEvent = () => {
    console.log("subscribe global notify message event");
    BackendFactory.getInstance().dataListener.addOnChatListener(notify);
};
export const unsubscribeGlobalNotifyMessageEvent = () => {
    BackendFactory.getInstance().dataListener.removeOnChatListener(notify);
};
export const notify = (messageImp) => {
    let message = {
        title: messageImp.user.username,
        image: messageImp.user.avatar
    };
    if (messageImp.type === MessageType[MessageType.Text]) {
        CryptoHelper.decryptionText(messageImp).then((decoded) => {
            message.body = decoded.body;
            getStore().dispatch(stalkNotiNewMessage(message));
        });
    }
    else {
        message.body = `Sent you ${messageImp.type.toLowerCase()}`;
        getStore().dispatch(stalkNotiNewMessage(message));
    }
};
