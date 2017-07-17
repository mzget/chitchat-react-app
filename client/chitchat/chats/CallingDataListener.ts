import { CallingEvents } from "stalk-js";

export type CallPayload = {
    event: string;
    members: Array<string>;
    payload: any;
};
type IListener = (data: CallPayload) => void;

export class CallingDataListener implements CallingEvents.ICallingListener {

    private onCallListeners: Array<IListener> = new Array();
    public addOnCallListener(fx: IListener) {
        this.onCallListeners.push(fx);
    }
    public removeOnCallListener(fx: IListener) {
        let id = this.onCallListeners.indexOf(fx);
        this.onCallListeners.splice(id, 1);
    }

    onCall(dataEvent: CallPayload) {
        this.onCallListeners.forEach(fx => fx(dataEvent));
    }
}