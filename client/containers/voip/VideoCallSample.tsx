import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual, compose } from "recompose";
import Flexbox from "flexbox-react";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, FontIcon, Slider, Paper } from "material-ui";
import { WithDialog } from "../toolsbox/DialogBoxEnhancer";

import { WebRtc } from "../../chitchat/react-webrtc/WebRTC";
import * as Peer from "../../chitchat/react-webrtc/Peer";

import { IComponentProps } from "../../utils/IComponentProps";

import { SimpleToolbar } from "../../components/SimpleToolbar";

interface IComponentNameState {
}


function getEl(idOrEl) {
    if (typeof idOrEl === 'string') {
        return document.getElementById(idOrEl);
    } else {
        return idOrEl;
    }
};

class VideoCall extends React.Component<IComponentProps, IComponentNameState> {
    webrtc = new WebRtc();
    remotesView;
    selfView;

    constructor(props) {
        super(props);

        this.state = {
            isMuteVoice: false,
            isPauseVideo: false,
            micVol: 100,
            selfViewSrc: null,
            remoteSrc: null
        }

        this.onBackPressed = this.onBackPressed.bind(this);
        this.onTitlePressed = this.onTitlePressed.bind(this);

        this.addVideo = this.addVideo.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.readyToCall = this.readyToCall.bind(this);
        this.connectionReady = this.connectionReady.bind(this);
        this.disconnect = this.disconnect.bind(this);

        this.webrtc.webrtcEvents.on(WebRtc.CONNECTION_READY, this.connectionReady);
        this.webrtc.webrtcEvents.on(WebRtc.READY_TO_CALL, this.readyToCall);
        this.webrtc.webrtcEvents.on(Peer.PEER_STREAM_ADDED, this.addVideo);
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
        this.webrtc.webrtcEvents.on("error", (err) => console.log("joinRoom fail", err));
        this.webrtc.webrtcEvents.on("createdPeer", (peer) => console.log("createdPeer", peer));
        this.webrtc.webrtcEvents.on("joinedRoom", (roomName) => console.log("joinedRoom", roomName));
    }

    connectionReady(socker_id) {
        let self = this;
        this.webrtc.getLocalStream(function (stream) {
            self.readyToCall(stream);
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.disconnect();
    }

    addVideo(stream) {
        console.log("addvideo", stream);

        let remotesView = getEl(ReactDOM.findDOMNode(this.refs.remotes));
        remotesView.src = URL.createObjectURL(stream);
        remotesView.muted = true;
        remotesView.autoplay = true;
        remotesView.mirror = false;

        this.setState({ remoteSrc: stream });
    }
    removeVideo() {
        let remotesView = getEl(ReactDOM.findDOMNode(this.refs.remotes));
        remotesView.disable = true;

        // this.setState({ remoteSrc: null });
    }
    disconnect() {
        this.webrtc.leaveRoom();
        this.webrtc.disconnect();
        // this.webrtc.stopLocalVideo();
        // this.props.dispatch(calling.onVideoCallEnded());
    }

    readyToCall(stream) {
        let self = this;

        let selfView = getEl(ReactDOM.findDOMNode(this.refs.localVideo));
        // let video = document.createElement('video');
        // video.oncontextmenu = function () { return false; };
        // el.appendChild(video);
        if (!selfView) return;
        selfView.src = URL.createObjectURL(stream);
        selfView.muted = true;
        selfView.autoplay = true;
        selfView.mirror = false;

        this.setState({ selfViewSrc: stream });

        this.webrtc.join("exe");

        // let { match, userReducer: { user }, stalkReducer } = this.props;
        // let incommingCall = stalkReducer.get("incommingCall");
        // if (!!incommingCall) {
        //     this.webrtc.join(incommingCall.room_id, () => {
        //         self.props.dispatch(calling.onCalling(incommingCall.room_id));
        //     });
        // }
        // else {
        //     let room_id = match.params.id;
        //     this.webrtc.join(room_id, () => {
        //         self.props.dispatch(calling.onCalling(room_id));
        //     });

        // let room = chatroom.getRoom(room_id);
        // let targets = new Array<string>();
        // if (!!room) {
        //     room.members.map(value => {
        //         if (value._id !== user._id) {
        //             targets.push(value._id);
        //         }
        //     });
        // }

        //     this.props.dispatch(calling.videoCall_Epic({ target_ids: targets, user_id: user._id, room_id: match.params.id }));
        // }
    }

    componentWillMount() {
        if (!this.props.teamReducer.team) {
            this.props.history.replace("/");
        }
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let prevInline = this.props.stalkReducer.get("inline");
        let nextInline = nextProps.stalkReducer.get("inline");
        if (!nextInline && !shallowEqual(nextInline, prevInline)) {
            this.onBackPressed();
        }
    }

    onBackPressed() {
        // Jump to main menu.
        this.props.history.goBack();
    }
    onTitlePressed() {
        let { history, teamReducer } = this.props;
        history.replace(`/team/${teamReducer.team._id}`);
    }

    render(): JSX.Element {
        let { team } = this.props.teamReducer;
        return (
            <Flexbox flexDirection="column" style={{ backgroundColor: Colors.blueGrey50 }}>
                <div style={{ position: "relative", height: "56px" }}>
                    <div style={{ position: "fixed", width: "100%", zIndex: 1 }} >
                        <SimpleToolbar
                            title={(!!team) ? team.name.toUpperCase() : ""}
                            onBackPressed={this.onBackPressed}
                            onPressTitle={this.onTitlePressed} />
                    </div>
                </div>
                <Flexbox flexDirection="row" height="150px" justifyContent={"flex-start"}>
                    <div ref="localContainer" style={{ position: 'relative', width: '200px', height: '150px' }}>
                        <video style={{ height: "150px", width: '100%' }}
                            className="local"
                            id="localVideo"
                            ref="localVideo" >
                        </video>
                    </div>
                </Flexbox>
                <video style={{ width: "100%" }}
                    className="remotes"
                    id="remoteVideos"
                    ref="remotes">
                </video>
            </Flexbox>
        );
    }
}

const mapStateToProps = (state) => ({
    userReducer: state.userReducer,
    alertReducer: state.alertReducer,
    teamReducer: state.teamReducer,
    stalkReducer: state.stalkReducer
});
const enhance = compose(
    WithDialog,
    withRouter,
    connect(mapStateToProps)
);
export const VideoCallSample = enhance(VideoCall);
