"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function getContactProfile(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        /*
        let self = this;
        let dataManager = BackendFactory.getInstance().dataManager;
        let user = dataManager.getContactProfile(userId) as ContactInfo;
    
        return new Promise((resolve: (data: ContactInfo) => void, rejected) => {
            if (!user) {
                UserService.getUserInfo(userId)
                    .then(result => result.json())
                    .then(result => {
                        console.log("getUserInfo value", result);
    
                        if (result.success) {
                            let user = result.data[0];
                            let contact: ContactInfo = {
                                _id: user._id, displayname: `${user.first_name} ${user.last_name}`, status: "", image: user.avatar
                            };
                            dataManager.setContactProfile(user._id, contact);
    
                            resolve(contact);
                        }
                        else {
                            dataManager.setContactProfile(userId, {} as ContactInfo);
                            rejected(result.message);
                        }
                    }).catch(err => {
                        console.warn("getUserInfo fail", err);
                        rejected(err);
                    });
            }
            else {
                resolve(user);
            }
        });
        */
    });
}
exports.getContactProfile = getContactProfile;
