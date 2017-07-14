/*
This is a Tutorial App with a simpleWebRTC React component.
Compatible with Chrome and Firefox.

1. To join a room uncomment the line 76 in readyToCall(){...} and provide a room name in joinRoom('change-this-roomname').

2. The app by default uses the signal server from simplewebrtc.com. To use a custom Signal server such as the one in  https://github.com/andyet/signalmaster, provide your url link in the code (line 38) as shown in the example at https://simplewebrtc.com/notsosimple.html. 
*/

import * as React from "react";
import * as ReactDOM from 'react-dom';

import Flexbox from "flexbox-react";
import SimpleWebRTC from 'simplewebrtc';

interface ICompProps {
    obj: {
        roomname: string;
        signalmasterUrl: string;
    }
}

export class WebRtc extends React.Component<ICompProps, any> {
    webrtc: any;

    constructor(props) {
        super(props);

        this.addVideo = this.addVideo.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.readyToCall = this.readyToCall.bind(this);
    }

    componentDidMount() {
        this.webrtc = new SimpleWebRTC({
            localVideoEl: ReactDOM.findDOMNode(this.refs.local),
            remoteVideosEl: "",
            autoRequestMedia: true,
            url: this.props.obj.signalmasterUrl
        });

        console.log("webrtc component mounted");
        this.webrtc.on('connectionReady', function (sessionId) {
            console.log("connectionReady", sessionId);
        })
        this.webrtc.on('videoAdded', this.addVideo);
        this.webrtc.on('videoRemoved', this.removeVideo);
        this.webrtc.on('readyToCall', this.readyToCall);
    }

    addVideo(video, peer) {
        console.log('video added', peer);
        //  console.log(this.refs.remotes);
        let remotes = ReactDOM.findDOMNode(this.refs.remotes);
        console.log(remotes);
        if (remotes) {
            var container = document.createElement('div');
            container.className = 'videoContainer';
            container.id = 'container_' + this.webrtc.getDomId(peer);
            container.appendChild(video);
            // suppress contextmenu
            video.oncontextmenu = function () {
                return false;
            };
            console.log(container);
            remotes.appendChild(container);
        }
    }

    removeVideo(video, peer) {
        console.log('video removed ', peer);
        let remotes = ReactDOM.findDOMNode(this.refs.remotes);
        let el = document.getElementById(peer ? 'container_' + this.webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    }

    readyToCall() {
        console.log('readyToCall ', this.props.obj.roomname);
        return this.webrtc.joinRoom(this.props.obj.roomname);
    }

    connect() {
        console.log("connected");
    }

    disconnect() {
        console.log("disconnected");
    }

    render() {
        return (
            <Flexbox flexDirection="column" justifyContent={"flex-start"}>
                <video style={{ width: "100%" }}
                    className="local"
                    id="localVideo"
                    ref="local" >
                </video>
                <div style={{ width: "100%" }}
                    className="remotes"
                    id="remoteVideos"
                    ref="remotes">
                </div>
            </Flexbox>
        );
    }
}