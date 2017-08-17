/*
This is a Tutorial App with a simpleWebRTC React component.
Compatible with Chrome and Firefox.

1. To join a room uncomment the line 76 in readyToCall(){...} and provide a room name in joinRoom('change-this-roomname').

2. The app by default uses the signal server from simplewebrtc.com. To use a custom Signal server such as the one in  https://github.com/andyet/signalmaster, provide your url link in the code (line 38) as shown in the example at https://simplewebrtc.com/notsosimple.html. 
*/

import * as React from "react";
import * as ReactDOM from 'react-dom';

import Flexbox from "flexbox-react";
import SimpleWebRTC from '../../chitchat/libs/simplewebrtc';

import { signalingServer } from "../../Chitchat";

export class WebRtcDemo extends React.Component<any, any> {
    webrtc: any;
    roomname: string = "chitchate-rtc";

    constructor(props) {
        super(props);

        this.addVideo = this.addVideo.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.readyToCall = this.readyToCall.bind(this);

        this.disconnect = this.disconnect.bind(this);
    }

    componentWillUnmount() {
        this.disconnect();
    }

    componentDidMount() {
        let self = this;
        this.webrtc = new SimpleWebRTC({
            localVideoEl: ReactDOM.findDOMNode(this.refs.local),
            remoteVideosEl: "",
            autoRequestMedia: true,
            enableDataChannels: false,
            url: signalingServer,
            debug: false
        });

        console.log("webrtc component mounted");

        this.webrtc.on('connectionReady', function (sessionId) {
            console.log("connectionReady", sessionId);
        });
        this.webrtc.on("leftRoom", (roomName) => {
            console.log("leftRoom", roomName);
        });
        this.webrtc.on("createdPeer", peer => {
            console.log("createdPeer", peer);
        });
        this.webrtc.on('videoAdded', this.addVideo);
        this.webrtc.on('videoRemoved', this.removeVideo);
        this.webrtc.on('readyToCall', this.readyToCall);
        // local p2p/ice failure
        this.webrtc.on('iceFailed', function (peer) {
            console.warn("iceFailed", peer);
            let connstate = document.querySelector('#container_' + self.webrtc.getDomId(peer) + ' .connectionstate');
            console.log('local fail', connstate);
            if (connstate) {
                connstate.innerText = 'Connection failed.';
                // fileinput.disabled = 'disabled';
            }
        });

        // remote p2p/ice failure
        this.webrtc.on('connectivityError', function (peer) {
            console.warn("connectivityError", peer);
            let connstate = document.querySelector('#container_' + self.webrtc.getDomId(peer) + ' .connectionstate');
            console.log('remote fail', connstate);
            if (connstate) {
                connstate.innerText = 'Connection failed.';
                // fileinput.disabled = 'disabled';
            }
        });
    }

    addVideo(video, peer) {
        //  console.log(this.refs.remotes);
        let remotes = ReactDOM.findDOMNode(this.refs.remotes);
        // console.log(remotes);
        if (remotes) {
            let container = document.createElement('div');
            container.className = 'videoContainer';
            container.id = 'container_' + this.webrtc.getDomId(peer);
            container.appendChild(video);

            // suppress contextmenu
            video.oncontextmenu = function () {
                return false;
            };
            remotes.appendChild(container);

            // show the ice connection state
            if (peer && peer.pc) {
                let connstate = document.createElement('div');
                connstate.className = 'connectionstate';
                container.appendChild(connstate);

                peer.pc.on('iceConnectionStateChange', function (event) {
                    switch (peer.pc.iceConnectionState) {
                        case 'checking':
                            connstate.innerText = 'Connecting to peer...';
                            break;
                        case 'connected':
                            connstate.innerText = 'connected...';
                            break;
                        case 'completed': // on caller side
                            connstate.innerText = 'Connection established.';
                            break;
                        case 'disconnected':
                            connstate.innerText = 'Disconnected.';
                            break;
                        case 'failed':
                            break;
                        case 'closed':
                            connstate.innerText = 'Connection closed.';
                            break;
                    }
                });
            }
        }
        else {
            console.warn("can't find remotes dom!");
        }
    }

    removeVideo(video, peer) {
        let remotes = ReactDOM.findDOMNode(this.refs.remotes);
        let el = document.getElementById(peer ? 'container_' + this.webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    }

    readyToCall() {
        console.log('readyToCall');
        this.webrtc.joinRoom(this.roomname);
    }

    disconnect() {
        this.webrtc.leaveRoom();
        this.webrtc.disconnect();
        this.webrtc = null;
    }

    render() {
        return (
            <Flexbox flexDirection="column" justifyContent={"flex-start"}>
                <Flexbox flexDirection="row" height="150px" justifyContent={"flex-start"}>
                    <video style={{ width: "150px" }}
                        className="local"
                        id="localVideo"
                        ref="local" >
                    </video>
                    <video style={{ width: "150px" }}
                        className="remotes"
                        id="remoteVideos"
                        ref="remotes">
                    </video>
                    <video style={{ width: "150px" }}
                        className="remotes"
                        id="remoteVideos"
                        ref="remotes">
                    </video>
                    <video style={{ width: "150px" }}
                        className="remotes"
                        id="remoteVideos"
                        ref="remotes">
                    </video>
                </Flexbox>
                <div style={{ width: "100%" }}
                    className="remotes"
                    id="remoteVideos"
                    ref="remotes">
                </div>
            </Flexbox>
        );
    }
}