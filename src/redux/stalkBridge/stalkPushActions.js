/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * This is pure function action for redux app.
 */
import { BackendFactory } from "stalk-js/starter";
import { ChatRoomComponent } from "stalk-simplechat";
export function stalkPushInit() {
    const pushDataListener = BackendFactory.getInstance().pushDataListener;
    pushDataListener.addPushEvents(onPush_handler);
}
function onPush_handler(dataEvent) {
    const push = dataEvent;
    console.log(`onPush_handler :`, push);
    const chatRoomComponent = ChatRoomComponent.getInstance();
    if (push.event === "onMessageRead") {
        if (!!chatRoomComponent) {
            ChatRoomComponent.getInstance().onMessageRead(push.message);
        }
    }
}
