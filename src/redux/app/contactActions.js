import Store from "../configureStore";
export async function getContactProfile(contactId) {
    const { members } = Store.getState().teamReducer;
    let _members = members;
    let contacts = _members.filter((v, i, arr) => {
        return v._id === contactId;
    });
    return contacts;
}
