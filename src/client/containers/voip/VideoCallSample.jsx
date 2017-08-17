import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual } from "recompose";
import Flexbox from "flexbox-react";
import * as Colors from "material-ui/styles/colors";
import { WithDialog } from "../toolsbox/DialogBoxEnhancer";
import { WebRtc } from "../../chitchat/react-webrtc/WebRTC";
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
        this.webrtc = new WebRtc();
        this.state = {
            isMuteVoice: false,
            isPauseVideo: false,
            micVol: 100,
            selfViewSrc: null,
            remoteSrc: null
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onTitlePressed = this.onTitlePressed.bind(this);
        this.addVideo = this.addVideo.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.readyToCall = this.readyToCall.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.webrtc.myEmitter.on("readyToCall", this.readyToCall);
        this.webrtc.myEmitter.on(Peer.PEER_STREAM_ADDED, this.addVideo);
        this.webrtc.myEmitter.on(Peer.PEER_STREAM_REMOVED, this.removeVideo);
        this.webrtc.myEmitter.on(Peer.CONNECTIVITY_ERROR, (peer) => {
            console.log(Peer.CONNECTIVITY_ERROR, peer);
        });
        this.webrtc.myEmitter.on(Peer.MUTE, (data) => {
            console.log(Peer.MUTE, data);
        });
        this.webrtc.myEmitter.on(Peer.UNMUTE, (data) => {
            console.log(Peer.UNMUTE, data);
        });
        this.webrtc.myEmitter.on("error", (err) => console.log("joinRoom fail", err));
        this.webrtc.myEmitter.on("createdPeer", (peer) => console.log("createdPeer", peer));
        this.webrtc.myEmitter.on("joinedRoom", (roomName) => console.log("joinedRoom", roomName));
    }
    componentDidMount() {
    }
    componentWillUnmount() {
        this.disconnect();
    }
    addVideo(stream) {
        let remotesView = getEl(ReactDOM.findDOMNode(this.refs.remotes));
        remotesView.src = URL.createObjectURL(stream);
        remotesView.muted = true;
        remotesView.autoplay = true;
        remotesView.mirror = false;
    }
    removeVideo() {
        let remotesView = getEl(ReactDOM.findDOMNode(this.refs.remotes));
        remotesView.disable = true;
    }
    disconnect() {
        this.webrtc.leaveRoom();
        this.webrtc.disconnect();
    }
    readyToCall(stream) {
        let self = this;
        let selfView = getEl(ReactDOM.findDOMNode(this.refs.localVideo));
        if (!selfView)
            return;
        selfView.src = URL.createObjectURL(stream);
        selfView.muted = true;
        selfView.autoplay = true;
        selfView.mirror = false;
        this.webrtc.join("exe");
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
                <Flexbox flexDirection="row" height="150px" justifyContent={"flex-start"}>
                    <div ref="localContainer" style={{ position: 'relative', width: '200px', height: '150px' }}>
                        <video style={{ height: "150px", width: '100%' }} className="local" id="localVideo" ref="localVideo">
                        </video>
                    </div>
                </Flexbox>
                <video style={{ width: "100%" }} className="remotes" id="remoteVideos" ref="remotes">
                </video>
            </Flexbox>);
    }
}
const mapStateToProps = (state) => ({
    userReducer: state.userReducer,
    alertReducer: state.alertReducer,
    teamReducer: state.teamReducer,
    stalkReducer: state.stalkReducer
});
export var VideoCallSample = WithDialog(VideoCall);
VideoCallSample = connect(mapStateToProps)(VideoCall);
VideoCallSample = withRouter(VideoCallSample);
