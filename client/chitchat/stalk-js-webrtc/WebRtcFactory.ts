/**
 * WebRtcFactory.
 *
 * Copyright 2017 Ahoo Studio.co.th.
 */
import { REACT_NATIVE, REACTJS } from "../consts/Platform";
import { WebRtcConfig, IWebRTC } from "./index";

export class WebRtcFactory {
    static async getObject(options: WebRtcConfig): Promise<IWebRTC> {
        console.log("userAgent", global["userAgent"]);

        if (!!global["userAgent"] && global["userAgent"] === REACTJS) {
            const { WebRTC } = await import("../react-webrtc/WebRTC");
            return new WebRTC(options);
        }
        else if (!!global["userAgent"] && global["userAgent"] === REACT_NATIVE) {
            // const { WebRTC } = require("../rn-webrtc/WebRTC");
            // return await new WebRTC(options);
        }
    }
}