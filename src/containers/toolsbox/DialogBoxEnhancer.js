import * as React from "react";
import { connect } from "react-redux";
import { withState, compose, pure, withHandlers, lifecycle, shallowEqual } from "recompose";
import { DialogBox } from "../../components/DialogBox";
const mapStateToProps = (state) => ({
    alertReducer: state.alertReducer
});
export const DialogBoxEnhancer = compose(connect(mapStateToProps), withState("title", "setTitle", "Alert!"), withState("message", "setMessage", ({ message }) => message), withState("open", "setOpen", false), lifecycle({
    componentWillReceiveProps(nextProps) {
        let { alertReducer } = nextProps;
        if (!shallowEqual(alertReducer.error, this.props.alertReducer.error) && alertReducer.error != null) {
            this.props.setMessage(message => alertReducer.error);
            this.props.setOpen(open => true);
        }
    }
}), withHandlers({
    onError: (props) => (error) => {
        props.setMessage(message => error);
        props.setOpen(open => true);
    },
    handleClose: (props) => () => {
        props.setMessage(message => "");
        props.setOpen(open => false);
        props.dispatch({ type: "CLEAR_ALERT" });
    }
}), pure);
export function WithDialog(WrappedComponent) {
    class DialogHOC extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                message: "",
                open: false,
                title: "Alert!"
            };
            this.handleClose = this.handleClose.bind(this);
            this.onError = this.onError.bind(this);
        }
        componentWillReceiveProps(nextProps) {
            let { alertReducer } = nextProps;
            if (!shallowEqual(alertReducer.error, this.props.alertReducer.error) && alertReducer.error != null) {
                this.setState({ message: alertReducer.error, open: true });
            }
        }
        onError(error) {
            this.setState({ message: error, open: true });
        }
        handleClose() {
            this.setState({ message: "", open: false });
            this.props.dispatch({ type: "CLEAR_ALERT" });
        }
        render() {
            // Wraps the input component in a container, without mutating it. Good!
            return (<div>
                    <WrappedComponent onError={this.onError}/>
                    <DialogBox title={this.state.title} message={this.state.message} open={this.state.open} handleClose={this.handleClose}/>
                </div>);
        }
    }
    return connect(mapStateToProps)(DialogHOC);
}
