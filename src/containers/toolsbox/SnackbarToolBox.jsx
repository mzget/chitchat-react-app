import * as React from "react";
import { connect } from "react-redux";
import { SnackbarSimple } from "../../components/SnackbarSimple";
;
class SnackbarBox extends React.Component {
    componentWillMount() {
        this.state = {
            openSnackbar: false,
            snackbarMessage: "",
            snackbarClose: null
        };
        this.closeSnackbar = this.closeSnackbar.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { stalkReducer } = nextProps;
        if (stalkReducer.notiMessage != this.props.stalkReducer.notiMessage) {
            this.setState(previousState => (Object.assign({}, previousState, { openSnackbar: true, snackbarMessage: stalkReducer.notiMessage.body })));
        }
    }
    closeSnackbar(reason) {
        this.setState(previousState => (Object.assign({}, previousState, { openSnackbar: false })));
    }
    render() {
        return (<div>
                <SnackbarSimple open={this.state.openSnackbar} message={this.state.snackbarMessage} handleRequestClose={this.closeSnackbar} hideDuration={2000}/>
            </div>);
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return Object.assign({}, state); }
export const SnackbarToolBox = connect(mapStateToProps)(SnackbarBox);
