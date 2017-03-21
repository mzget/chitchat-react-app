import Store from "../configureStore";

import { Member } from "../../chats/models/Member";

export async function getContactProfile(contactId: string) {
    const {members} = Store.getState().teamReducer;
    let _members = members as Array<Member>;
    let contacts = _members.filter((v, i, arr) => {
        return v._id === contactId;
    });

    return contacts;
}