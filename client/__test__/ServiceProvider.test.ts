import { getLastAccessRoomInfo, updateLastAccessRoomInfo, removeLastAccessRoomInfo } from "../chitchat/chats/services/ServiceProvider";

test('getLastAccessRoomInfo', () => {
    let { chitchatFactory } = require("../Chitchat");
    chitchatFactory.setAuthStore("test", "test_token");

    expect(getLastAccessRoomInfo("1234")).toMatchObject({});
});


test('updateLastAccessRoomInfo', () => {
    let { chitchatFactory } = require("../Chitchat");
    chitchatFactory.setAuthStore("test", "test_token");

    expect(updateLastAccessRoomInfo("1234", "1234")).toMatchObject({});
});


test('removeLastAccessRoomInfo', () => {
    let { chitchatFactory } = require("../Chitchat");
    chitchatFactory.setAuthStore("test", "test_token");

    expect(removeLastAccessRoomInfo("1234", "1234")).toMatchObject({});
});