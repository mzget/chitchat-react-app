import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { MapBox } from "./MapBox";
const actions = (props) => [
    React.createElement(FlatButton, { label: "Cancel", primary: true, onTouchTap: props.onClose }),
    React.createElement(FlatButton, { label: "Submit", primary: true, onTouchTap: props.onSubmit }),
];
export const MapDialog = (props) => (React.createElement("div", null,
    React.createElement(Dialog, { title: "Your Location", actions: actions(props), modal: true, open: props.open, contentStyle: {
            width: 480,
            height: 600
        } },
        React.createElement(MapBox, { onLocationChange: props.onLocationChange }))));
