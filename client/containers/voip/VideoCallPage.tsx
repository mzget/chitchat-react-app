import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual, compose } from "recompose";
import Flexbox from "flexbox-react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, FontIcon, Slider, Paper } from "material-ui";


import { IComponentProps } from "../../utils/IComponentProps";
import { WithDialog } from "../toolsbox/DialogBoxEnhancer";
import { SimpleToolbar } from "../../components/SimpleToolbar";
import { WebRtcPage } from "./";

interface IComponentNameState {
}

class VideoCall extends React.Component<IComponentProps, IComponentNameState> {

    constructor(props) {
        super(props);

        this.state = {
            isMuteAudio: false,
            isPauseVideo: false,
            micVol: 100,
        }

        this.onBackPressed = this.onBackPressed.bind(this);
        this.onTitlePressed = this.onTitlePressed.bind(this);
        this.getWebRtc = this.getWebRtc.bind(this);
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

    getWebRtc(webrtc) {
        this.webrtc = webrtc;
    }

    render(): JSX.Element {
        let { team } = this.props.teamReducer;

        let disabledAudioOption = true;
        let disabledVideoOption = true;
        if (!!this.webrtc && Array.isArray(this.webrtc.webrtc.localStreams) && this.webrtc.webrtc.localStreams.length > 0) {
            if (this.webrtc.webrtc.localStreams[0].getAudioTracks().length > 0) {
                disabledAudioOption = false;
            }
            if (this.webrtc.webrtc.localStreams[0].getVideoTracks().length > 0) {
                disabledVideoOption = false;
            }
        }
        return (
            <MuiThemeProvider>
                <Flexbox flexDirection="column" style={{ backgroundColor: Colors.blueGrey50 }}>
                    <div style={{ position: "relative", height: "56px" }}>
                        <div style={{ position: "fixed", width: "100%", zIndex: 1 }} >
                            <SimpleToolbar
                                title={(!!team) ? team.name.toUpperCase() : ""}
                                onBackPressed={this.onBackPressed}
                                onPressTitle={this.onTitlePressed} />
                        </div>
                    </div>
                    <Flexbox flexDirection="row" height="calc(100vh - 56px)">
                        <Flexbox flexDirection="column" minWidth="400px">
                            {
                                this.state.isMuteAudio ?
                                    <RaisedButton secondary
                                        disabled={disabledAudioOption}
                                        icon={<FontIcon className="material-icons">mic_off</FontIcon>}
                                        onClick={() => {
                                            this.webrtc.unmute();
                                            this.webrtc.webrtc.emit('changeLocalVolume', this.state.micVol / 100);
                                            this.setState({ isMuteAudio: false });
                                        }} />
                                    :
                                    <RaisedButton
                                        disabled={disabledAudioOption}
                                        icon={<FontIcon className="material-icons">mic</FontIcon>}
                                        onClick={() => {
                                            this.webrtc.mute();
                                            this.setState({ isMuteAudio: true });
                                        }} />
                            }
                            {
                                this.state.isPauseVideo ?
                                    <RaisedButton secondary
                                        disabled={disabledVideoOption}
                                        icon={<FontIcon className="material-icons">videocam_off</FontIcon>}
                                        onClick={() => {
                                            this.webrtc.resumeVideo();
                                            this.setState({ isPauseVideo: false });
                                        }} />
                                    :
                                    <RaisedButton
                                        disabled={disabledVideoOption}
                                        icon={<FontIcon className="material-icons">videocam</FontIcon>}
                                        onClick={() => {
                                            this.webrtc.pauseVideo();
                                            this.setState({ isPauseVideo: true });
                                        }} />
                            }
                            <Paper style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                minHeight: '36px'
                            }}>
                                <div>{`Mic volume (${this.state.micVol}%)`}</div>
                                <Slider min={0} max={100} step={1}
                                    disabled={disabledAudioOption}
                                    defaultValue={100}
                                    sliderStyle={{
                                        margin: 0,
                                    }}
                                    style={{
                                        width: '50%',
                                        maxWidth: '200px',
                                    }}
                                    onChange={(e, newValue) => {
                                        this.setState({ micVol: newValue, isMuteVoice: newValue == 0 });
                                        this.webrtc.webrtc.emit('changeLocalVolume', newValue / 100);
                                    }} />
                            </Paper>
                        </Flexbox>
                        <Flexbox flexGrow={1} justifyContent="center">
                            <WebRtcPage getWebRtc={this.getWebRtc} onError={this.props.onError} />
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </MuiThemeProvider >
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
    withRouter,
    WithDialog,
    connect(mapStateToProps)
);
export const VideoCallPage = enhance(VideoCall);
