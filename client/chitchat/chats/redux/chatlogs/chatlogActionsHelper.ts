
import { BackendFactory } from "../../BackendFactory";
import * as UserService from "../../services/UserService";

import { ContactInfo } from "../../models/Contact";

export async function getContactProfile(userId: string) {
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
}