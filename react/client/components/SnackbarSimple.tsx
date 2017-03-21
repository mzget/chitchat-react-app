import * as React from 'react';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

type ISnackbarProps = {
    open: boolean,
    message: string,
    hideDuration: number,
    handleRequestClose: (reason: string) => void
}

export const SnackbarSimple = (props: ISnackbarProps) => (
    <MuiThemeProvider>
        <div>
            <Snackbar
                open={props.open}
                message={props.message}
                autoHideDuration={(props.hideDuration) ? props.hideDuration : 4000}
                onRequestClose={props.handleRequestClose}
                />
        </div>
    </MuiThemeProvider >
);