import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { } from "recompose";

import { MapBox } from "./MapBox";

interface IMapDialogProps {
    open: boolean;
}

export class MapDialog extends React.Component<IMapDialogProps, any> {

    componentWillMount() {
    }

    handleOpen() { }

    handleClose() { }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                disabled={true}
                onTouchTap={this.handleClose}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="Map Dialog"
                    actions={actions}
                    modal={true}
                    open={this.props.open}
                    contentStyle={{
                        width: 480,
                        height: 600
                    }}
                >
                    <MapBox />
                </Dialog>
            </div>
        );
    }
}
