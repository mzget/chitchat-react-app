import Store from "../configureStore";

import { MemberImp } from "../../chitchat/chats/models/MemberImp";

export async function getContactProfile(contactId: string) {
    const { members } = Store.getState().teamReducer;

    let _members = members as Array<MemberImp>;
    let contacts = _members.filter((v, i, arr) => {
        return v._id === contactId;
    });

    return contacts;
}