import { getLastAccessRoomInfo, removeLastAccessRoomInfo, updateLastAccessRoomInfo, } from "../chitchat/chats/services/ServiceProvider";
test("getLastAccessRoomInfo", () => {
    const { chitchatFactory } = require("../Chitchat");
    chitchatFactory.setAuthStore("test", "test_token");
    expect(getLastAccessRoomInfo("1234")).toMatchObject({});
});
test("updateLastAccessRoomInfo", () => {
    const { chitchatFactory } = require("../Chitchat");
    chitchatFactory.setAuthStore("test", "test_token");
    expect(updateLastAccessRoomInfo("1234", "1234")).toMatchObject({});
});
test("removeLastAccessRoomInfo", () => {
    const { chitchatFactory } = require("../Chitchat");
    chitchatFactory.setAuthStore("test", "test_token");
    expect(removeLastAccessRoomInfo("1234", "1234")).toMatchObject({});
});
