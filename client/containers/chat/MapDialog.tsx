import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { } from "recompose";

import { MapBox } from "./MapBox";

interface IMapDialogProps {
    open: boolean;
    onClose: () => void;
}

const actions = (props) => [
    <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={props.onClose}
    />,
    <FlatButton
        label="Submit"
        primary={true}
        disabled={true}
        onTouchTap={props.onClose}
    />,
];

export const MapDialog = (props: IMapDialogProps) => (
    <div>
        <Dialog
            title="Map Dialog"
            actions={actions(props)}
            modal={true}
            open={props.open}
            contentStyle={{
                width: 480,
                height: 600
            }}
        >
            <MapBox />
        </Dialog>
    </div>
);
