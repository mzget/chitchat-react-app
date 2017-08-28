import * as React from 'react';
export class PeerStatus extends React.Component {
    componentWillMount() {
        this.state = {
            peerIceState: "",
            peerIceGatheringState: "",
            peerSignalingState: ""
        };
        this.peerAdded = this.peerAdded.bind(this);
    }
    componentWillUnmount() {
        delete this.peerEvent;
    }
    componentWillReceiveProps({ peer }) {
        if (!!peer && peer != this.props.peer) {
            this.peerAdded(peer);
        }
    }
    peerAdded(peer) {
        let self = this;
        self.peerEvent = peer.target;
        self.peerEvent.oniceconnectionstatechange = (event) => {
            let target = event.target;
            self.setState(prev => (Object.assign({}, prev, { peerIceState: target.iceConnectionState })));
        };
        self.peerEvent.onicegatheringstatechange = (event) => {
            let target = event.target;
            self.setState(prev => (Object.assign({}, prev, { peerIceGatheringState: target.iceGatheringState })));
        };
        self.peerEvent.onsignalingstatechange = (event) => {
            let target = event.target;
            self.setState(prev => (Object.assign({}, prev, { peerSignalingState: target.signalingState })));
        };
    }
    render() {
        return (<div>
                <p style={{ fontSize: 11 }}>iceConnectionState: {this.state.peerIceState}</p>
                <p style={{ fontSize: 11 }}>iceGatheringState: {this.state.peerIceGatheringState}</p>
                <p style={{ fontSize: 11 }}>signalingState: {this.state.peerSignalingState}</p>
            </div>);
    }
}
