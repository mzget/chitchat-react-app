import * as React from "react";
import { RaisedButton, TextField } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dialog from "material-ui/Dialog";
import CircularProgress from 'material-ui/CircularProgress';

import { connect } from "react-redux";
import { pure, lifecycle, withState, compose, shallowEqual, ComponentEnhancer } from "recompose";

import { IComponentProps } from "../../utils/IComponentProps";


export interface IDialoxBoxProps {
    message?: string;
    open: boolean;
    handleClose: () => void;
}
const FetchingDialog = (props: IDialoxBoxProps) => {
    return (
        <MuiThemeProvider>
            <Dialog contentStyle={{ width: "350px" }}
                title={"Loading..."}
                modal={true}
                open={props.open}
                onRequestClose={props.handleClose} >
                <CircularProgress />
            </Dialog>
        </MuiThemeProvider>
    );
};

const enhance = compose(
    connect((state => ({ teamReducer: state.teamReducer }))),
    withState("open", "setOpen", false),
    lifecycle({
        componentWillReceiveProps(nextProps: IComponentProps) {
            if (!shallowEqual(this.props.teamReducer.isFetching, nextProps.teamReducer.isFetching)) {
                this.props.setOpen(open => nextProps.teamReducer.isFetching);
            }
        }
    }),
    pure
);
export const FetchingDialogEnhance = enhance(({ open }) =>
    <FetchingDialog open={open} />
);