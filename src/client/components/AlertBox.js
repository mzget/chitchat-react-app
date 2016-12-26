import * as React from "react";
import Dialog from 'react-toolbox/lib/dialog';
import theme from 'react-toolbox/lib/ripple/theme';
const actions = (props) => [
    { label: "Cancel", onClick: props.handleToggle },
    { label: "Save", onClick: props.handleToggle }
];
export const AlertBox = (props) => (React.createElement("div", null,
    React.createElement(Dialog, { theme: theme, actions: actions(props), active: props.active, onEscKeyDown: props.handleToggle, onOverlayClick: props.handleToggle, title: 'My awesome dialog' },
        React.createElement("p", null, "Here you can add arbitrary content. Components like Pickers are using dialogs now."))));
