import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual } from "recompose";
import Flexbox from "flexbox-react";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";
import { RaisedButton, FontIcon } from "material-ui";

import { IComponentProps } from "../../utils/IComponentProps";

import { SimpleToolbar } from "../../components/SimpleToolbar";
import { WebRtcPage } from "../webrtc/";

interface IComponentNameState {
}

class VideoCall extends React.Component<IComponentProps, IComponentNameState> {

    constructor(props) {
        super(props);

        this.state = {
            isMuteVoice: false,
            isPauseVideo: false,
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
        history.replace(`/chatslist/${teamReducer.team.name}`);
    }

    getWebRtc(webrtc) {
        this.webrtc = webrtc;
    }

    render(): JSX.Element {
        return (
            <MuiThemeProvider>
                <Flexbox flexDirection="column" style={{ backgroundColor: Colors.blueGrey50 }}>
                    <div style={{ position: "relative", height: "56px" }}>
                        <div style={{ position: "fixed", width: "100%", zIndex: 1 }} >
                            <SimpleToolbar
                                title={this.props.teamReducer.team.name.toUpperCase()}
                                onBackPressed={this.onBackPressed}
                                onPressTitle={this.onTitlePressed} />
                        </div>
                    </div>
                    <Flexbox flexDirection="row" height="calc(100vh - 56px)">
                        <Flexbox flexDirection="column" minWidth="400px">
                            {
                                this.state.isMuteVoice ?
                                    <RaisedButton secondary
                                        icon={<FontIcon className="material-icons">volume_off</FontIcon>}
                                        onClick={() => {
                                            this.webrtc.unmute();
                                            this.setState({ isMuteVoice: false });
                                        }} />
                                    :
                                    <RaisedButton
                                        icon={<FontIcon className="material-icons">volume_up</FontIcon>}
                                        onClick={() => {
                                            this.webrtc.mute();
                                            this.setState({ isMuteVoice: true });
                                        }} />
                            }
                            {
                                this.state.isPauseVideo ?
                                    <RaisedButton secondary
                                        icon={<FontIcon className="material-icons">videocam_off</FontIcon>}
                                        onClick={() => {
                                            this.webrtc.resumeVideo();
                                            this.setState({ isPauseVideo: false });
                                        }} />
                                    :
                                    <RaisedButton
                                        icon={<FontIcon className="material-icons">videocam</FontIcon>}
                                        onClick={() => {
                                            this.webrtc.pauseVideo();
                                            this.setState({ isPauseVideo: true });
                                        }} />
                            }
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
export var VideoCallPage = connect(mapStateToProps)(VideoCall) as React.ComponentClass<{ onError }>;
VideoCallPage = withRouter<any>(VideoCallPage);
