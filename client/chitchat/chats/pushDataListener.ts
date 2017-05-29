import { StalkEvents } from "stalk-js";

export class PushDataListener implements StalkEvents.IPushServerListener {
    private onPushEvents: Array<(dataEvent) => void> = new Array();
    public addPushEvents(fx: (dataEvent) => void) {
        this.onPushEvents.push(fx);
    }
    public removePushEvents(fx: (dataEvent) => void) {
        let id = this.onPushEvents.indexOf(fx);
        this.onPushEvents.splice(id, 1);
    }

    onPush(dataEvent) {
        this.onPushEvents.forEach(fx => fx(dataEvent));
    }
}