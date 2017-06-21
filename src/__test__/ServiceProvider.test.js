"use strict";
exports.__esModule = true;
var ServiceProvider_1 = require("../chitchat/chats/services/ServiceProvider");
test('getLastAccessRoomInfo', function () {
    var chitchatFactory = require("../Chitchat").chitchatFactory;
    chitchatFactory.setAuthStore("test", "test_token");
    expect(ServiceProvider_1.getLastAccessRoomInfo("1234")).toMatchObject({});
});
test('updateLastAccessRoomInfo', function () {
    var chitchatFactory = require("../Chitchat").chitchatFactory;
    chitchatFactory.setAuthStore("test", "test_token");
    expect(ServiceProvider_1.updateLastAccessRoomInfo("1234", "1234")).toMatchObject({});
});
test('removeLastAccessRoomInfo', function () {
    var chitchatFactory = require("../Chitchat").chitchatFactory;
    chitchatFactory.setAuthStore("test", "test_token");
    expect(ServiceProvider_1.removeLastAccessRoomInfo("1234", "1234")).toMatchObject({});
});
