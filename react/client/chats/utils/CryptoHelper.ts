import SecureServiceFactory from "../secure/secureServiceFactory";
import { MessageImp } from "../models/MessageImp";
import { MessageType } from "../../libs/shared/Message";

import config from "../../configs/config";

export const decryptionText = async (message: MessageImp) => {
    if (!message) return message;

    let secure = SecureServiceFactory.getService();

    if (message.type === MessageType[MessageType.Text]) {
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