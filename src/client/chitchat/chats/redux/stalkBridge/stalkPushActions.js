import { BackendFactory } from "../../BackendFactory";
import { ChatRoomComponent } from "../../ChatRoomComponent";
export function stalkPushInit() {
    const pushDataListener = BackendFactory.getInstance().pushDataListener;
    pushDataListener.addPushEvents(onPush_handler);
}
function onPush_handler(dataEvent) {
    let push = dataEvent;
    console.log(`onPush_handler :`, push);
    let chatRoomComponent = ChatRoomComponent.getInstance();
    if (push.event == "onMessageRead") {
        if (!!chatRoomComponent) {
            ChatRoomComponent.getInstance().onMessageRead(push.message);
        }
    }
}
