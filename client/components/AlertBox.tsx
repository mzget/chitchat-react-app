import * as React from "react";
import Dialog from 'react-toolbox/lib/dialog';
import { Button } from 'react-toolbox/lib/button';
import theme from 'react-toolbox/lib/ripple/theme';

interface ICompProps {
    active: boolean;
    handleToggle;
}

const actions = (props: ICompProps) => [
    { label: "Cancel", onClick: props.handleToggle },
    { label: "Save", onClick: props.handleToggle }
];
export const AlertBox = (props: ICompProps) => (
    <div>
        <Dialog theme={theme}
            actions={actions(props)}
            active={props.active}
            onEscKeyDown={props.handleToggle}
            onOverlayClick={props.handleToggle}
            title='My awesome dialog'
            >
            <p>Here you can add arbitrary content. Components like Pickers are using dialogs now.</p>
        </Dialog>
    </div>
);