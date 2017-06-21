import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { } from "recompose";

import { MapBox, Point } from "./MapBox";

interface IMapDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onLocationChange: (position: Point) => void;
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
        onTouchTap={props.onSubmit}
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
            <MapBox onLocationChange={props.onLocationChange} />
        </Dialog>
    </div>
);
