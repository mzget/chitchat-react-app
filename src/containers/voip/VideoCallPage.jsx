import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { SimpleToolbar } from "../../components/SimpleToolbar";
import { WebRtcDemo } from "../../webrtc/";
class VideoCall extends React.Component {
    constructor(props) {
        super(props);
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onTitlePressed = this.onTitlePressed.bind(this);
    }
    componentWillReceiveProps(nextProps) {
    }
    onBackPressed() {
        // Jump to main menu.
        this.props.history.goBack();
    }
    onTitlePressed() {
        let { history, teamReducer } = this.props;
        history.replace(`/chatslist/${teamReducer.team.name}`);
    }
    render() {
        return (<MuiThemeProvider>
                <Flexbox flexDirection="column" style={{ backgroundColor: Colors.blueGrey50 }}>
                    <div style={{ position: "relative", height: "56px" }}>
                        <div style={{ position: "fixed", width: "100%", zIndex: 1 }}>
                            <SimpleToolbar title={this.props.teamReducer.team.name.toUpperCase()} onBackPressed={this.onBackPressed} onPressTitle={this.onTitlePressed}/>
                        </div>
                    </div>
                    <Flexbox flexDirection="row" height="calc(100vh - 56px)">
                        <Flexbox minWidth="400px" justifyContent="center">
                        </Flexbox>
                        <Flexbox flexGrow={1} justifyContent="center">
                            <WebRtcDemo />
                        </Flexbox>
                    </Flexbox>
                </Flexbox>
            </MuiThemeProvider>);
    }
}
const mapStateToProps = (state) => ({
    teamReducer: state.teamReducer
});
export var VideoCallPage = connect(mapStateToProps)(VideoCall);
VideoCallPage = withRouter(VideoCallPage);
