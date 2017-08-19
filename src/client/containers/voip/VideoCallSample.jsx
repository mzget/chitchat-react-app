import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual, compose } from "recompose";
import Flexbox from "flexbox-react";
import * as Colors from "material-ui/styles/colors";
import { WithDialog } from "../toolsbox/DialogBoxEnhancer";
import { signalingServer } from "../../Chitchat";
import { WebRTC } from "../../chitchat/react-webrtc/WebRTC";
import * as Peer from "../../chitchat/react-webrtc/Peer";
import { SimpleToolbar } from "../../components/SimpleToolbar";
function getEl(idOrEl) {
    if (typeof idOrEl === 'string') {
        return document.getElementById(idOrEl);
    }
    else {
        return idOrEl;
    }
}
;
class VideoCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMuteVoice: false,
            isPauseVideo: false,
            micVol: 100,
            selfViewSrc: null,
            remoteSrc: null,
            peerStat: ""
        };
        let rtcConfig = {
            signalingUrl: signalingServer,
            socketOptions: { 'force new connection': true },
            debug: true
        };
        this.webrtc = new WebRTC(rtcConfig);
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onTitlePressed = this.onTitlePressed.bind(this);
        this.peerAdded = this.peerAdded.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.readyToCall = this.readyToCall.bind(this);
        this.connectionReady = this.connectionReady.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.webrtc.webrtcEvents.on(WebRTC.CONNECTION_READY, this.connectionReady);
        this.webrtc.webrtcEvents.on(Peer.PEER_STREAM_ADDED, this.peerAdded);
        this.webrtc.webrtcEvents.on(Peer.PEER_STREAM_REMOVED, this.removeVideo);
        this.webrtc.webrtcEvents.on(Peer.CONNECTIVITY_ERROR, (peer) => {
            console.log(Peer.CONNECTIVITY_ERROR, peer);
        });
        this.webrtc.webrtcEvents.on(Peer.MUTE, (data) => {
            console.log(Peer.MUTE, data);
        });
        this.webrtc.webrtcEvents.on(Peer.UNMUTE, (data) => {
            console.log(Peer.UNMUTE, data);
        });
        this.webrtc.webrtcEvents.on(WebRTC.JOIN_ROOM_ERROR, (err) => console.log("joinRoom fail", err));
        this.webrtc.webrtcEvents.on(WebRTC.CREATED_PEER, (peer) => console.log("createdPeer", peer));
        this.webrtc.webrtcEvents.on(WebRTC.JOINED_ROOM, (roomName) => console.log("joinedRoom", roomName));
    }
    connectionReady(socker_id) {
        let self = this;
        let requestMedia = { video: true, audio: true };
        this.webrtc.getLocalStream(requestMedia, function (stream) {
            self.readyToCall(stream);
        });
    }
    componentDidMount() {
    }
    componentWillUnmount() {
        this.disconnect();
    }
    peerAdded(peer) {
        console.log("peerAdded", peer);
        let remotesView = getEl(ReactDOM.findDOMNode(this.refs.remotes));
        remotesView.src = URL.createObjectURL(peer.stream);
        if (peer && peer.pc) {
            let peerStat = "";
            peer.pc.on('iceConnectionStateChange', function (event) {
                switch (peer.pc.iceConnectionState) {
                    case 'checking':
                        peerStat = 'Connecting to peer...';
                        break;
                    case 'connected':
                        peerStat = 'connected...';
                        break;
                    case 'completed':
                        peerStat = 'Connection established.';
                        break;
                    case 'disconnected':
                        peerStat = 'Disconnected.';
                        break;
                    case 'failed':
                        break;
                    case 'closed':
                        peerStat = 'Connection closed.';
                        break;
                }
                this.setState({ peerStat: peerStat });
            });
        }
        this.setState({ remoteSrc: peer.stream });
    }
    removeVideo() {
        let remotesView = getEl(ReactDOM.findDOMNode(this.refs.remotes));
        remotesView.disable = true;
        this.setState({ remoteSrc: null });
    }
    disconnect() {
        this.webrtc.leaveRoom();
        this.webrtc.disconnect();
    }
    readyToCall(stream) {
        let self = this;
        let { match } = this.props;
        let selfView = getEl(ReactDOM.findDOMNode(this.refs.localVideo));
        if (!selfView)
            return;
        selfView.src = URL.createObjectURL(stream);
        this.setState({ selfViewSrc: stream });
        this.webrtc.join(match.params.id);
    }
    componentWillMount() {
        if (!this.props.teamReducer.team) {
            this.props.history.replace("/");
        }
    }
    componentWillReceiveProps(nextProps) {
        let prevInline = this.props.stalkReducer.get("inline");
        let nextInline = nextProps.stalkReducer.get("inline");
        if (!nextInline && !shallowEqual(nextInline, prevInline)) {
            this.onBackPressed();
        }
    }
    onBackPressed() {
        this.props.history.goBack();
    }
    onTitlePressed() {
        let { history, teamReducer } = this.props;
        history.replace(`/team/${teamReducer.team._id}`);
    }
    render() {
        let { team } = this.props.teamReducer;
        return (<Flexbox flexDirection="column" style={{ backgroundColor: Colors.blueGrey50 }}>
                <div style={{ position: "relative", height: "56px" }}>
                    <div style={{ position: "fixed", width: "100%", zIndex: 1 }}>
                        <SimpleToolbar title={(!!team) ? team.name.toUpperCase() : ""} onBackPressed={this.onBackPressed} onPressTitle={this.onTitlePressed}/>
                    </div>
                </div>
                <Flexbox flexDirection="row" height="100%" justifyContent={"flex-start"}>
                    <div ref="localContainer" style={{ position: 'relative', width: '200px', height: '150px' }}>
                        <video style={{ height: "150px", width: '100%' }} className="local" id="localVideo" ref="localVideo" autoPlay={true} muted={true}>
                        </video>
                    </div>
                    <video style={{ width: "100%", height: "300px" }} className="remotes" id="remoteVideos" ref="remotes" autoPlay={true} muted={true}>
                    </video>
                </Flexbox>
            </Flexbox>);
    }
}
const mapStateToProps = (state) => ({
    userReducer: state.userReducer,
    alertReducer: state.alertReducer,
    teamReducer: state.teamReducer,
    stalkReducer: state.stalkReducer
});
const enhance = compose(WithDialog, withRouter, connect(mapStateToProps));
export const VideoCallSample = enhance(VideoCall);
