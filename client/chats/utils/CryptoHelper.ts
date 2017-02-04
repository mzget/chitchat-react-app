import { MessageImp } from "../models/MessageImp";
import { ContentType } from "../models/ChatDataModels";
import config from "../../configs/config";
import SecureServiceFactory from "../../libs/chitchat/services/secureServiceFactory";

export const decryptionText = async (message: MessageImp) => {
    let secure = SecureServiceFactory.getService();

    if (message.type === ContentType[ContentType.Text]) {
        if (config.appConfig.encryption === true) {
            let result = await secure.decryption(message.body);

            message.body = result;
            return message;
        }
        else {
            return message;
        }
    }
    else {
        return message;
    }
};

export const hashComputation = (message) => {
    let secure = SecureServiceFactory.getService();
    return new Promise((resolve, reject) => {
        secure.hashCompute(message, (err, res) => {
            resolve(res);
        });
    });
};