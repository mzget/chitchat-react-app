"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const chitchatFactory_1 = require("../../chitchatFactory");
const getTeam = () => chitchatFactory_1.ChitChatFactory.getInstance().teamStore;
function getContactProfile(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let members = getTeam().members;
        return new Promise((resolve, rejected) => {
            if (!members || members.length <= 0) {
                return rejected("No have members");
            }
            let users = members.filter(value => {
                return value._id == userId;
            });
            if (users.length > 0) {
                let user = users[0];
                resolve(user);
            }
            else {
                rejected("No implemented functions");
            }
        });
    });
}
exports.getContactProfile = getContactProfile;
