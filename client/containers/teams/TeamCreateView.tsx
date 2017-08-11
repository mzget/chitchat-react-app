import * as React from "react";
import Flexbox from "flexbox-react";
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';

const styles = {
    span: {
        padding: 8
    },
    button: {
        width: '100%'
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};

const SubmitButton = (props: ITypingBox) => (
    <RaisedButton primary={true} label="Create" onClick={props.onCreateTeam} style={{ height: 40, margin: 4 }}>
    </RaisedButton>
);

interface ITypingBox {
    onCreateTeam: () => void;
    team_name: string;
    onNameChange: (e, text) => void;
}

export const TeamCreateView = (props: ITypingBox) => {
    return (
        < MuiThemeProvider >
            <Flexbox flexDirection="column" alignItems='center' justifyContent='center' >
                <p>Create a new team</p>
                <Flexbox flexDirection="row">
                    <TextField hintText="Enter a team name" value={props.team_name} onChange={props.onNameChange} onKeyDown={(e) => {
                        if (e.key === 'Enter') props.onCreateTeam();
                    }} />
                    <SubmitButton {...props} />
                </Flexbox>
            </Flexbox>
        </MuiThemeProvider >
    );
}