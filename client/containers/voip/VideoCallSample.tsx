import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual, compose } from "recompose";
import Flexbox from "flexbox-react";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, FontIcon, Slider, Paper } from "material-ui";
import { WithDialog } from "../toolsbox/DialogBoxEnhancer";
import { MuiThemeProvider, getMuiTheme } from "material-ui/styles";

import { signalingServer } from "../../Chitchat";
import { WebRtcFactory, STALKWEBRTC, IWebRTC, WebRtcConfig, PeerConnections } from "../../chitchat/stalk-js-webrtc/index";

import { IComponentProps } from "../../utils/IComponentProps";

import { SimpleToolbar } from "../../components/SimpleToolbar";

interface IComponentNameState {
    remoteSrc;
    selfViewSrc;
    isMuteVoice;
    isPauseVideo;
    remoteVolume;
    micVol;
    peerStat;
    isHoverPeer;
}


function getEl(idOrEl) {
    if (typeof idOrEl === 'string') {
        return document.getElementById(idOrEl);
    } else {
        return idOrEl;
    }
};

class VideoCall extends React.Component<IComponentProps, IComponentNameState> {
    webrtc: IWebRTC;
    remotesView;
    selfView;

    async startWebRtc() {
        let rtcConfig = {
            signalingUrl: signalingServer,
            socketOptions: { 'force new connection': true },
            debug: true
        } as WebRtcConfig;
        this.webrtc = await WebRtcFactory.getObject(rtcConfig);

        this.onBackPressed = this.onBackPressed.bind(this);
        this.onTitlePressed = this.onTitlePressed.bind(this);

        this.peerAdded = this.peerAdded.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.readyToCall = this.readyToCall.bind(this);
        this.connectionReady = this.connectionReady.bind(this);
        this.disconnect = this.disconnect.bind(this);

        this.webrtc.webrtcEvents.on(STALKWEBRTC.CONNECTION_READY, this.connectionReady);
        this.webrtc.webrtcEvents.on(STALKWEBRTC.JOIN_ROOM_ERROR, (err) => console.log("joinRoom fail", err));
        this.webrtc.webrtcEvents.on(STALKWEBRTC.CREATED_PEER, (peer) => console.log("createdPeer", peer.id));
        this.webrtc.webrtcEvents.on(STALKWEBRTC.JOINED_ROOM, (roomName) => console.log("joinedRoom", roomName));

        this.webrtc.webrtcEvents.on(PeerConnections.PEER_STREAM_ADDED, this.peerAdded);
        this.webrtc.webrtcEvents.on(PeerConnections.PEER_STREAM_REMOVED, this.removeVideo);
        this.webrtc.webrtcEvents.on(PeerConnections.CONNECTIVITY_ERROR, (peer) => {
            console.log(PeerConnections.CONNECTIVITY_ERROR, peer);
        });
        this.webrtc.webrtcEvents.on(PeerConnections.MUTE, (data) => {
            console.log(PeerConnections.MUTE, data);
        });
        this.webrtc.webrtcEvents.on(PeerConnections.UNMUTE, (data) => {
            console.log(PeerConnections.UNMUTE, data);
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            isMuteVoice: false,
            isPauseVideo: false,
            micVol: 100,
            selfViewSrc: null,
            remoteSrc: null,
            peerStat: "",
            remoteVolume: 100,
            isHoverPeer: false,
        }

        this.startWebRtc();
    }

    connectionReady(socker_id) {
        let self = this;

        let hdConstraints = {
            video: {
                mandatory: {
                    minWidth: 1280,
                    minHeight: 720
                }
            } as MediaTrackConstraints
        };
        let vgaConstraints = {
            video: {
                mandatory: {
                    maxWidth: 640,
                    maxHeight: 360
                }
            } as MediaTrackConstraints
        };
        let requestMedia = {
            video: vgaConstraints.video, audio: true
        } as MediaStreamConstraints;
        this.webrtc.userMedia.startLocalStream(requestMedia).then(function (stream) {
            self.readyToCall(stream);
        }).catch(err => {
            console.error("LocalStream Fail", err);
            self.props.onError("LocalStream Fail: " + err);
        });
    }

    peerAdded(peer) {
        console.log("peerAdded", peer);

        let remotesView = getEl(ReactDOM.findDOMNode(this.refs.remotes));
        remotesView.src = URL.createObjectURL(peer.stream);
        remotesView.volume = 1;

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
                    case 'completed': // on caller side
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

        this.setState({ remoteSrc: peer.stream, remoteVolume: 100 });
    }
    removeVideo() {
        let remotesView = getEl(ReactDOM.findDOMNode(this.refs.remotes));
        remotesView.disable = true;

        this.setState({ remoteSrc: null });
    }
    disconnect() {
        this.webrtc.leaveRoom();
        this.webrtc.disconnect();
        // this.webrtc.stopLocalVideo();
        // this.props.dispatch(calling.onVideoCallEnded());
    }

    readyToCall(stream: MediaStream) {
        let self = this;
        let { match } = this.props;

        let selfView = getEl(ReactDOM.findDOMNode(this.refs.localVideo));
        // let video = document.createElement('video');
        // video.oncontextmenu = function () { return false; };
        // el.appendChild(video);
        if (!selfView) return;
        selfView.src = URL.createObjectURL(stream);

        this.setState({ selfViewSrc: stream });

        this.webrtc.join(match.params.id);
    }

    componentWillMount() {
        if (!this.props.teamReducer.team) {
            this.props.history.replace("/");
        }
    }

    componentWillUnmount() {
        this.disconnect();
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

        let disabledAudioOption = true;
        let disabledVideoOption = true;
        if (!!this.state.selfViewSrc &&
            !!this.webrtc.userMedia.micController &&
            this.webrtc.userMedia.micController.support) {
            if (this.state.selfViewSrc.getAudioTracks().length > 0) {
                disabledAudioOption = false;
            }
            if (this.state.selfViewSrc.getVideoTracks().length > 0) {
                disabledVideoOption = false;
            }
        }

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
                <Flexbox flexDirection="row" height="100%" justifyContent={"flex-start"}>
                    <div ref="localContainer" style={{ position: 'relative', width: '200px', height: '150px' }}>
                        <video
                            style={{ height: "150px", width: '100%' }}
                            className="local"
                            id="localVideo"
                            ref="localVideo"
                            autoPlay={true}
                            muted={true} >
                        </video>
                        <Slider min={0} max={100} step={1}
                            disabled={disabledAudioOption}
                            defaultValue={100}
                            sliderStyle={{
                                margin: 0,
                            }}
                            onChange={(e, newValue) => {
                                this.setState({ micVol: newValue, isMuteVoice: newValue == 0 });
                                this.webrtc.userMedia.micController.setVolume(newValue / 100);
                            }} />
                        <div>{`Mic volume (${this.state.micVol}%)`}</div>
                        {
                            this.state.isMuteVoice ?
                                <RaisedButton secondary
                                    disabled={disabledAudioOption}
                                    icon={<FontIcon className="material-icons">mic_off</FontIcon>}
                                    onClick={() => {
                                        this.webrtc.userMedia.micController.unMute();
                                        this.webrtc.userMedia.micController.setVolume(this.state.micVol / 100);
                                        this.setState({ isMuteVoice: false });
                                        /* this.webrtc.unmute();
                                        this.webrtc.webrtc.emit('changeLocalVolume', this.state.micVol / 100); */
                                    }} />
                                :
                                <RaisedButton
                                    disabled={disabledAudioOption}
                                    icon={<FontIcon className="material-icons">mic</FontIcon>}
                                    onClick={() => {
                                        this.webrtc.userMedia.micController.mute();
                                        this.setState({ isMuteVoice: true });
                                        //this.webrtc.mute();
                                    }} />
                        }
                        {
                            this.state.isPauseVideo ?
                                <RaisedButton secondary
                                    disabled={disabledVideoOption}
                                    icon={<FontIcon className="material-icons">videocam_off</FontIcon>}
                                    onClick={() => {
                                        this.webrtc.userMedia.setVideoEnabled(true);
                                        this.setState({ isPauseVideo: false });
                                    }} />
                                :
                                <RaisedButton
                                    disabled={disabledVideoOption}
                                    icon={<FontIcon className="material-icons">videocam</FontIcon>}
                                    onClick={() => {
                                        this.webrtc.userMedia.setVideoEnabled(false);
                                        this.setState({ isPauseVideo: true });
                                    }} />
                        }
                    </div>
                    <div style={{ width: "100%", height: "300px", textAlign: "center" }}>
                        <div
                            onMouseOver={() => { this.setState({ isHoverPeer: true }) }}
                            onMouseLeave={() => { this.setState({ isHoverPeer: false }) }}
                            style={{ display: "inline-block", height: "300px", position: "relative" }}>
                            <video
                                style={{ height: "300px", display: this.state.remoteSrc ? "initial" : "none" }}
                                className="remotes"
                                id="remoteVideos"
                                ref="remotes"
                                autoPlay={true} />
                            {
                                this.state.isHoverPeer ?
                                    [
                                        <div style={{
                                            position: "absolute",
                                            bottom: 0,
                                            width: "100%",
                                            height: "30%",
                                            backgroundPosition: "bottom",
                                            backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==)",
                                            "filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#000000', endColorstr='#3d3d3d', GradientType=0 )"
                                        }}>
                                        </div>,
                                        <div id="remoteController"
                                            style={{
                                                position: "absolute",
                                                width: "100%",
                                                height: "15%",
                                                bottom: 0,
                                                display: this.state.remoteSrc ? "flex" : "none",
                                                alignItems: "center",
                                                padding: "0 5px",
                                            }}>
                                            <div style={{ color: "#fff", width: "41px" }}>
                                                {`${this.state.remoteVolume}%`}
                                            </div>
                                            <MuiThemeProvider
                                                muiTheme={getMuiTheme({
                                                    slider: {
                                                        trackColor: 'rgba(255,255,255,0.5)',
                                                        selectionColor: '#fff',
                                                        rippleColor: 'rgba(255,255,255,0.5)'
                                                    }
                                                })}>
                                                <Slider min={0} max={100} step={1}
                                                    value={this.state.remoteVolume}
                                                    onChange={(e, newValue) => {
                                                        this.setState({ remoteVolume: newValue });
                                                        getEl(ReactDOM.findDOMNode(this.refs.remotes)).volume = newValue / 100;
                                                    }}
                                                    sliderStyle={{
                                                        margin: 0,
                                                    }}
                                                    style={{
                                                        width: "30%",
                                                        margin: "0 5px",
                                                    }} />
                                            </MuiThemeProvider>
                                        </div>
                                    ]
                                    :
                                    null
                            }
                        </div>

                    </div>
                </Flexbox>
            </Flexbox >
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
