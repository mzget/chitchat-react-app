import * as React from "react";
import Flexbox from "flexbox-react";
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';

const FindButton = (props: ITypingBox) => (
    <RaisedButton primary={true} label="Find" onClick={props.onSubmit} style={{ height: 40, margin: 4 }}>
    </RaisedButton>
);

interface ITypingBox {
    team_name: string;
    onSubmit: () => void;
    onNameChange: (e, text) => void;
    onCreateNewPress: () => void;
}

export const FindTeamView = (props: ITypingBox) => {
    return (
        < MuiThemeProvider >
            <Flexbox flexDirection="column" alignItems='center' justifyContent='center' >
                <p>Join an existing team</p>
                <Flexbox flexDirection="row">
                    <TextField hintText="Enter a team name" value={props.team_name} onChange={props.onNameChange} onKeyDown={(e) => {
                        if (e.key === 'Enter') props.onSubmit();
                    }} />
                    <FindButton {...props} />
                </Flexbox>
            </Flexbox>
        </MuiThemeProvider >
    );
}