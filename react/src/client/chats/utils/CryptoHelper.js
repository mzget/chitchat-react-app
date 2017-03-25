"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ChatDataModels_1 = require("../models/ChatDataModels");
const config_1 = require("../../configs/config");
const secureServiceFactory_1 = require("../../libs/chitchat/services/secureServiceFactory");
exports.decryptionText = (message) => __awaiter(this, void 0, void 0, function* () {
    let secure = secureServiceFactory_1.default.getService();
    if (message.type === ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]) {
        if (config_1.default.appConfig.encryption === true) {
            let result = yield secure.decryption(message.body);
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
});
exports.hashComputation = (message) => {
    let secure = secureServiceFactory_1.default.getService();
    return new Promise((resolve, reject) => {
        secure.hashCompute(message, (err, res) => {
            resolve(res);
        });
    });
};
