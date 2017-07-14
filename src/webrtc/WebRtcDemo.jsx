import * as React from "react";
import { WebRtc } from "./WebRtc";
import { signalingServer } from "../Chitchat";
export class WebRtcDemo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let object = {
            roomname: "chitchat-test",
            /*provide a valid url for signalmaster otherwise this won't work*/
            signalmasterUrl: signalingServer
        };
        return (<div>
                <WebRtc obj={object}/>
            </div>);
    }
}
