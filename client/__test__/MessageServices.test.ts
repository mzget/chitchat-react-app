import * as MessageService from "../chitchat/chats/services/MessageService";

test('updateMessageReader', () => {
    let { chitchatFactory } = require("../Chitchat");
    chitchatFactory.setAuthStore("test", "test_token");

    expect(MessageService.updateMessageReader("qwerty", "1234")).toMatchObject({});
});