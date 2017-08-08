import { SimpleStorage } from "../chitchat/chats/dataAccessLayer/index";
export const createStorage = (storageName) => {
    return new SimpleStorage(storageName);
};
