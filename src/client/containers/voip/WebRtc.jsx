import * as React from "react";
import * as ReactDOM from 'react-dom';
import { connect } from "react-redux";
import { shallowEqual, compose } from "recompose";
import { withRouter } from "react-router-dom";
import Flexbox from "flexbox-react";
import Slider from 'material-ui/Slider';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { signalingServer } from "../../Chitchat";
import * as chatroom from "../../chitchat/chats/redux/chatroom/";
import * as calling from "../../chitchat/calling/";
import { WebRTC } from '../../chitchat/react-webrtc/WebRTC';
class WebRtc extends React.Component {
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
    componentWillReceiveProps(nextProps) {
        let { alertReducer: { error } } = nextProps;
        if (!shallowEqual(this.props.alertReducer.error, error) && !!error) {
            this.props.onError(error);
        }
        if (!error && this.props.alertReducer.error) {
            this.props.history.goBack();
        }
    }
    componentDidMount() {
        let self = this;
        let { stalkReducer } = this.props;
        let rtcConfig = {
            signalingUrl: signalingServer,
            socketOptions: { 'force new connection': true }
        };
        this.webrtc = new WebRTC(rtcConfig);
        this.props.getWebRtc(this.webrtc);
        this.webrtc.on('connectionReady', function (sessionId) {
            console.log("connectionReady", sessionId);
        });
        this.webrtc.on("leftRoom", (roomName) => {
            console.log("leftRoom", roomName);
        });
        this.webrtc.on("createdPeer", peer => {
            if (!peer.stream) {
                const peerId = self.webrtc.getDomId(peer);
                ReactDOM.render(<MuiThemeProvider>
                        <div className='videoContainer' id={`container_${peerId}`}>
                            <div style={{ width: '640px', height: '480px', background: 'black' }}>
                            </div>
                        </div>
                    </MuiThemeProvider>, ReactDOM.findDOMNode(self.refs.remotes));
            }
        });
        this.webrtc.on('videoAdded', this.addVideo);
        this.webrtc.on('videoRemoved', this.removeVideo);
        this.webrtc.on('readyToCall', this.readyToCall);
        this.webrtc.on('localMediaError', (err) => {
            console.warn('Fail to start local media: ', err);
        });
        this.webrtc.on('iceFailed', function (peer) {
            console.warn("iceFailed", peer);
            let connstate = document.querySelector('#container_' + self.webrtc.getDomId(peer) + ' .connectionstate');
            console.log('local fail', connstate);
            if (connstate) {
                connstate.innerText = 'Connection failed.';
            }
        });
        if (this.webrtc.config.detectSpeakingEvents) {
            this.webrtc.on('volumeChange', function (volume, treshold) {
                self.showVolume(document.getElementById('localVolume'), volume);
            });
        }
        this.webrtc.on('connectivityError', function (peer) {
            console.warn("connectivityError", peer);
            let connstate = document.getElementById('peer_connstate_' + this.webrtc.getDomId(peer));
            console.log('remote fail', connstate);
            if (connstate) {
                connstate.innerText = 'Connection failed.';
            }
        });
    }
    addVideo(video, peer) {
        console.log("addVideo", video, peer);
        const self = this;
        let remotes = ReactDOM.findDOMNode(this.refs.remotes);
        if (remotes) {
            const peerId = this.webrtc.getDomId(peer);
            if (peer && peer.pc) {
                peer.pc.on('iceConnectionStateChange', function (event) {
                    let connstate = document.getElementById('peer_connstate_' + peerId);
                    if (!connstate)
                        return;
                    switch (peer.pc.iceConnectionState) {
                        case 'checking':
                            connstate.innerText = 'Connecting to peer...';
                            break;
                        case 'connected':
                            connstate.innerText = 'connected...';
                            break;
                        case 'completed':
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
            this.webrtc.on('remoteVolumeChange', function (peer, volume) {
                if (volume !== null) {
                    self.showVolume(document.getElementById(`remoteVolume_${peerId}`), volume);
                }
            });
            ReactDOM.render(<MuiThemeProvider>
                    <div className='videoContainer' id={`container_${peerId}`}>
                        <div style={{ width: '640px', height: '480px', position: 'relative' }}>
                            <video onContextMenu={() => false} autoPlay id={peerId} onLoadStart={(e) => { e.target.volume = 0; }}/>
                            {this.webrtc.config.enableDataChannels ?
                <meter id={`remoteVolume_${peerId}`} style={{
                    position: 'absolute',
                    left: '15%',
                    width: '70%',
                    bottom: '2px',
                    height: '5px'
                }} min={-45} max={-20} low={-40} high={-25}/>
                :
                    null}
                            <Slider axis='y' min={0} max={100} step={1} defaultValue={100} onChange={(e, newValue) => {
                peer.videoEl.volume = newValue / 100;
            }} sliderStyle={{
                margin: 0,
            }} style={{
                position: 'absolute',
                height: '30%',
                left: '5px',
                bottom: '10px',
            }}/>
                        </div>
                        <div id={`peer_connstate_${peerId}`}></div>
                    </div>
                </MuiThemeProvider>, remotes, () => {
                document.getElementById(peerId).srcObject = peer.stream;
            });
        }
        else {
            console.warn("can't find remotes dom!");
        }
    }
    removeVideo(video, peer) {
        console.log("removeVideo", video, peer);
        let remotes = ReactDOM.findDOMNode(this.refs.remotes);
        let el = document.getElementById(peer ? 'container_' + this.webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            ReactDOM.unmountComponentAtNode(el);
        }
    }
    readyToCall() {
        let self = this;
        let { match, userReducer: { user }, stalkReducer } = this.props;
        let incommingCall = stalkReducer.get("incommingCall");
        if (!!incommingCall) {
            this.webrtc.joinRoom(incommingCall.room_id, () => {
                self.props.dispatch(calling.onCalling(incommingCall.room_id));
            });
        }
        else {
            let room_id = match.params.id;
            this.webrtc.joinRoom(room_id, () => {
                self.props.dispatch(calling.onCalling(room_id));
            });
            let room = chatroom.getRoom(room_id);
            let targets = new Array();
            if (!!room) {
                room.members.map(value => {
                    if (value._id !== user._id) {
                        targets.push(value._id);
                    }
                });
            }
            this.props.dispatch(calling.videoCall_Epic({ target_ids: targets, user_id: user._id, room_id: match.params.id }));
        }
    }
    disconnect() {
        this.webrtc.leaveRoom();
        this.webrtc.disconnect();
        this.webrtc.stopLocalVideo();
        this.props.dispatch(calling.onVideoCallEnded());
        let { match, userReducer: { user }, stalkReducer } = this.props;
        let room_id = match.params.id;
        let room = chatroom.getRoom(room_id);
        let targets = new Array();
        if (!!room && room.members.length > 0) {
            room.members.map(value => {
                if (value._id !== user._id) {
                    targets.push(value._id);
                }
            });
        }
        this.props.dispatch(calling.hangupCallRequest({ target_ids: targets, user_id: user._id }));
    }
    showVolume(el, volume) {
        if (!el)
            return;
        if (volume < -45)
            volume = -45;
        if (volume > -20)
            volume = -20;
        el.value = volume;
    }
    render() {
        return (<Flexbox flexDirection="column" justifyContent={"flex-start"}>
                <Flexbox flexDirection="row" height="150px" justifyContent={"flex-start"}>
                    <div ref="localContainer" style={{ position: 'relative', width: '200px', height: '150px' }}>
                        <video style={{ height: "150px", width: '100%' }} className="local" id="localVideo" ref="localVideo">
                        </video>
                        {(!!this.webrtc
            &&
                Array.isArray(this.webrtc.webrtc.unControllMic)
            &&
                this.webrtc.webrtc.unControllMic.length > 0)
            ?
                <meter id="localVolume" style={{
                    position: 'absolute',
                    left: '15%',
                    width: '70%',
                    bottom: '2px',
                    height: '5px'
                }} min={-45} max={-20} low={-40} high={-25}/>
            :
                null}
                    </div>
                    
                </Flexbox>
                <div style={{ width: "100%" }} className="remotes" id="remoteVideos" ref="remotes">
                </div>
                
            </Flexbox>);
    }
}
const mapStateToProps = (state) => ({
    userReducer: state.userReducer,
    alertReducer: state.alertReducer,
    stalkReducer: state.stalkReducer
});
const enhance = compose(withRouter, connect(mapStateToProps));
export const WebRtcPage = enhance(WebRtc);
