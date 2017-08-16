import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual } from "recompose";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, FontIcon, Slider, Paper } from "material-ui";
import { SimpleToolbar } from "../../components/SimpleToolbar";
import { WebRtcPage } from "../webrtc/";
class VideoCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMuteVoice: false,
            isPauseVideo: false,
            micVol: 100,
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onTitlePressed = this.onTitlePressed.bind(this);
        this.getWebRtc = this.getWebRtc.bind(this);
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
    getWebRtc(webrtc) {
        this.webrtc = webrtc;
    }
    render() {
        let { team } = this.props.teamReducer;
        return (<MuiThemeProvider>
                <Flexbox flexDirection="column" style={{ backgroundColor: Colors.blueGrey50 }}>
                    <div style={{ position: "relative", height: "56px" }}>
                        <div style={{ position: "fixed", width: "100%", zIndex: 1 }}>
                            <SimpleToolbar title={(!!team) ? team.name.toUpperCase() : ""} onBackPressed={this.onBackPressed} onPressTitle={this.onTitlePressed}/>
                        </div>
                    </div>
                    <Flexbox flexDirection="row" height="calc(100vh - 56px)">
                        <Flexbox flexDirection="column" minWidth="400px">
                            {this.state.isMuteVoice ?
            <RaisedButton secondary icon={<FontIcon className="material-icons">mic_off</FontIcon>} onClick={() => {
                this.webrtc.unmute();
                this.webrtc.webrtc.emit('changeLocalVolume', this.state.micVol / 100);
                this.setState({ isMuteVoice: false });
            }}/>
            :
                <RaisedButton icon={<FontIcon className="material-icons">mic</FontIcon>} onClick={() => {
                    this.webrtc.mute();
                    this.setState({ isMuteVoice: true });
                }}/>}
                            {this.state.isPauseVideo ?
            <RaisedButton secondary icon={<FontIcon className="material-icons">videocam_off</FontIcon>} onClick={() => {
                this.webrtc.resumeVideo();
                this.setState({ isPauseVideo: false });
            }}/>
            :
                <RaisedButton icon={<FontIcon className="material-icons">videocam</FontIcon>} onClick={() => {
                    this.webrtc.pauseVideo();
                    this.setState({ isPauseVideo: true });
                }}/>}
                            <Paper style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            minHeight: '36px'
        }}>
                                <div>{`Mic volume (${this.state.micVol}%)`}</div>
                                <Slider min={0} max={100} step={1} defaultValue={100} sliderStyle={{
            margin: 0,
        }} style={{
            width: '50%',
            maxWidth: '200px',
        }} onChange={(e, newValue) => {
            this.setState({ micVol: newValue, isMuteVoice: newValue == 0 });
            this.webrtc.webrtc.emit('changeLocalVolume', newValue / 100);
        }}/>
                            </Paper>
                        </Flexbox>
                        <Flexbox flexGrow={1} justifyContent="center">
                            <WebRtcPage getWebRtc={this.getWebRtc} onError={this.props.onError}/>
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </MuiThemeProvider>);
    }
}
const mapStateToProps = (state) => ({
    userReducer: state.userReducer,
    alertReducer: state.alertReducer,
    teamReducer: state.teamReducer,
    stalkReducer: state.stalkReducer
});
export var VideoCallPage = connect(mapStateToProps)(VideoCall);
VideoCallPage = withRouter(VideoCallPage);
