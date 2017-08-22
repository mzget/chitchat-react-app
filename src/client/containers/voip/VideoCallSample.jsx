var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual, compose } from "recompose";
import Flexbox from "flexbox-react";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, FontIcon, Slider, FlatButton } from "material-ui";
import { WithDialog } from "../toolsbox/DialogBoxEnhancer";
import { MuiThemeProvider, getMuiTheme } from "material-ui/styles";
import { signalingServer } from "../../Chitchat";
import { AbstractWEBRTC, AbstractPeerConnection, AbstractMediaStream, WebRtcFactory } from "../../chitchat/stalk-js-webrtc/index";
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
            peerStat: "",
            remoteVolume: 100,
            isHoverPeer: false,
            localStreamStatus: ""
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onTitlePressed = this.onTitlePressed.bind(this);
        this.changeMediaContraint = this.changeMediaContraint.bind(this);
        this.startWebRtc();
    }
    onBackPressed() {
        this.props.history.goBack();
    }
    onTitlePressed() {
        let { history, teamReducer } = this.props;
        history.replace(`/team/${teamReducer.team._id}`);
    }
    changeMediaContraint(media) {
        let self = this;
        let requestMedia = {
            video: media.video,
            audio: true
        };
        let peers = this.webrtc.peerManager.getPeers();
        peers.forEach((peer) => peer.removeStream(this.webrtc.userMedia.getLocalStream()));
        this.webrtc.userMedia.startLocalStream(requestMedia).then(function (stream) {
            self.onStreamReady(stream);
            peers.forEach(peer => peer.addStream(stream));
        }).catch(err => {
            console.error("LocalStream Fail", err);
            self.setState(prev => (Object.assign({}, prev, { localStreamStatus: err })));
            self.props.onError("LocalStream Fail: " + err);
        });
    }
    startWebRtc() {
        return __awaiter(this, void 0, void 0, function* () {
            let rtcConfig = {
                signalingUrl: signalingServer,
                socketOptions: { 'force new connection': true },
                debug: true,
            };
            this.webrtc = (yield WebRtcFactory.getObject(rtcConfig));
            this.peerAdded = this.peerAdded.bind(this);
            this.removeVideo = this.removeVideo.bind(this);
            this.onStreamReady = this.onStreamReady.bind(this);
            this.connectionReady = this.connectionReady.bind(this);
            this.webrtc.webrtcEvents.on(AbstractWEBRTC.CONNECTION_READY, this.connectionReady);
            this.webrtc.webrtcEvents.on(AbstractWEBRTC.JOIN_ROOM_ERROR, (err) => console.log("joinRoom fail", err));
            this.webrtc.webrtcEvents.on(AbstractWEBRTC.CREATED_PEER, (peer) => console.log("createdPeer", peer.id));
            this.webrtc.webrtcEvents.on(AbstractWEBRTC.JOINED_ROOM, (roomName) => console.log("joinedRoom", roomName));
            this.webrtc.webrtcEvents.on(AbstractPeerConnection.PEER_STREAM_ADDED, this.peerAdded);
            this.webrtc.webrtcEvents.on(AbstractPeerConnection.PEER_STREAM_REMOVED, this.removeVideo);
            this.webrtc.webrtcEvents.on(AbstractPeerConnection.CONNECTIVITY_ERROR, (peer) => {
                console.log(AbstractPeerConnection.CONNECTIVITY_ERROR, peer);
            });
            this.webrtc.webrtcEvents.on(AbstractPeerConnection.MUTE, (data) => {
                console.log(AbstractPeerConnection.MUTE, data);
            });
            this.webrtc.webrtcEvents.on(AbstractPeerConnection.UNMUTE, (data) => {
                console.log(AbstractPeerConnection.UNMUTE, data);
            });
        });
    }
    connectionReady(socker_id) {
        let self = this;
        let requestMedia = {
            video: AbstractMediaStream.vgaConstraints.video,
            audio: true
        };
        this.webrtc.userMedia.startLocalStream(requestMedia).then(function (stream) {
            self.onStreamReady(stream);
            let { match } = self.props;
            self.webrtc.join(match.params.id);
        }).catch(err => {
            console.error("LocalStream Fail", err);
            self.setState(prev => (Object.assign({}, prev, { localStreamStatus: err })));
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
        this.setState({ remoteSrc: peer.stream, remoteVolume: 100 });
    }
    removeVideo() {
        let remotesView = getEl(ReactDOM.findDOMNode(this.refs.remotes));
        remotesView.disable = true;
        this.setState({ remoteSrc: null });
    }
    onStreamReady(stream) {
        let selfView = getEl(ReactDOM.findDOMNode(this.refs.localVideo));
        if (!selfView)
            return;
        selfView.src = URL.createObjectURL(stream);
        this.selfAudioName = this.webrtc.userMedia.getAudioTrackName();
        this.selfVideoName = this.webrtc.userMedia.getVideoTrackName();
        this.setState({ selfViewSrc: stream, localStreamStatus: "ready" });
    }
    componentWillMount() {
        if (!this.props.teamReducer.team) {
            this.props.history.replace("/");
        }
    }
    componentWillUnmount() {
        if (!!this.webrtc) {
            this.webrtc.leaveRoom();
            this.webrtc.disconnect();
        }
    }
    componentWillReceiveProps(nextProps) {
        let prevInline = this.props.stalkReducer.get("inline");
        let nextInline = nextProps.stalkReducer.get("inline");
        if (!nextInline && !shallowEqual(nextInline, prevInline)) {
            this.onBackPressed();
        }
    }
    render() {
        let { team } = this.props.teamReducer;
        let disabledAudioOption = true;
        let disabledVideoOption = true;
        if (!!this.state.selfViewSrc) {
            if (this.state.selfViewSrc.getAudioTracks().length > 0 &&
                !!this.webrtc.userMedia.audioController &&
                this.webrtc.userMedia.audioController.support) {
                disabledAudioOption = false;
            }
            if (this.state.selfViewSrc.getVideoTracks().length > 0) {
                disabledVideoOption = false;
            }
        }
        return (<Flexbox flexDirection="column" style={{ backgroundColor: Colors.blueGrey50 }}>
                <div style={{ position: "relative", height: "56px" }}>
                    <div style={{ position: "fixed", width: "100%", zIndex: 1 }}>
                        <SimpleToolbar title={(!!team) ? team.name.toUpperCase() : ""} onBackPressed={this.onBackPressed} onPressTitle={this.onTitlePressed}/>
                    </div>
                </div>
                <Flexbox flexDirection="row" height="100%" justifyContent={"flex-start"}>
                    <div ref="localContainer" style={{ position: 'relative', width: '200px', height: '100%' }}>
                        <video style={{ height: "150px", width: '100%' }} className="local" id="localVideo" ref="localVideo" autoPlay={true} muted={true}>
                        </video>
                        <Slider min={0} max={100} step={1} disabled={disabledAudioOption} defaultValue={100} sliderStyle={{
            margin: 0,
        }} onChange={(e, newValue) => {
            this.setState({ micVol: newValue, isMuteVoice: newValue == 0 });
            this.webrtc.userMedia.audioController.setVolume(newValue / 100);
        }}/>
                        <div>{`Mic volume (${this.state.micVol}%)`}</div>
                        {this.state.isMuteVoice ?
            <RaisedButton secondary disabled={disabledAudioOption} icon={<FontIcon className="material-icons">mic_off</FontIcon>} onClick={() => {
                this.webrtc.userMedia.audioController.unMute();
                this.webrtc.userMedia.audioController.setVolume(this.state.micVol / 100);
                this.setState({ isMuteVoice: false });
            }}/>
            :
                <RaisedButton disabled={disabledAudioOption} icon={<FontIcon className="material-icons">mic</FontIcon>} onClick={() => {
                    this.webrtc.userMedia.audioController.mute();
                    this.setState({ isMuteVoice: true });
                }}/>}
                        {this.state.isPauseVideo ?
            <RaisedButton secondary disabled={disabledVideoOption} icon={<FontIcon className="material-icons">videocam_off</FontIcon>} onClick={() => {
                this.webrtc.userMedia.setVideoEnabled(true);
                this.setState({ isPauseVideo: false });
            }}/>
            :
                <RaisedButton disabled={disabledVideoOption} icon={<FontIcon className="material-icons">videocam</FontIcon>} onClick={() => {
                    this.webrtc.userMedia.setVideoEnabled(false);
                    this.setState({ isPauseVideo: true });
                }}/>}
                        <FlatButton label="HD" primary={true} onClick={() => this.changeMediaContraint(AbstractMediaStream.hdConstraints)}/>
                        <FlatButton label="VGA" primary={true} onClick={() => this.changeMediaContraint(AbstractMediaStream.vgaConstraints)}/>
                        <FlatButton label="QVGA" primary={true} onClick={() => this.changeMediaContraint(AbstractMediaStream.qvgaConstraints)}/>

                        <p style={{ fontSize: 12 }}>UserMedia: {this.state.localStreamStatus}</p>
                        <p style={{ fontSize: 12 }}>AudioTrack: {this.selfAudioName}</p>
                        <p style={{ fontSize: 12 }}>VideoTrack: {this.selfVideoName}</p>
                    </div>
                    <div style={{ width: "100%", height: "300px", textAlign: "center" }}>
                        <div onMouseOver={() => { this.setState({ isHoverPeer: true }); }} onMouseLeave={() => { this.setState({ isHoverPeer: false }); }} style={{ display: "inline-block", height: "300px", position: "relative" }}>
                            <video style={{ height: "300px", display: this.state.remoteSrc ? "initial" : "none" }} className="remotes" id="remoteVideos" ref="remotes" autoPlay={true}/>
                            {this.state.isHoverPeer ?
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
                <div id="remoteController" style={{
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
                                            <MuiThemeProvider muiTheme={getMuiTheme({
                    slider: {
                        trackColor: 'rgba(255,255,255,0.5)',
                        selectionColor: '#fff',
                        rippleColor: 'rgba(255,255,255,0.5)'
                    }
                })}>
                                                <Slider min={0} max={100} step={1} value={this.state.remoteVolume} onChange={(e, newValue) => {
                    this.setState({ remoteVolume: newValue });
                    getEl(ReactDOM.findDOMNode(this.refs.remotes)).volume = newValue / 100;
                }} sliderStyle={{
                    margin: 0,
                }} style={{
                    width: "30%",
                    margin: "0 5px",
                }}/>
                                            </MuiThemeProvider>
                                        </div>
            ]
            :
                null}
                        </div>

                    </div>
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
