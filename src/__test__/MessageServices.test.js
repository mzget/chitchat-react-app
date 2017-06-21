"use strict";
exports.__esModule = true;
var MessageService = require("../chitchat/chats/services/MessageService");
test('updateMessageReader', function () {
    var chitchatFactory = require("../Chitchat").chitchatFactory;
    chitchatFactory.setAuthStore("test", "test_token");
    expect(MessageService.updateMessageReader("qwerty", "1234")).toMatchObject({});
});
