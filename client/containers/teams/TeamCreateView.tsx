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
    <RaisedButton primary={true} label="Create Team" onClick={props.onCreateTeam}>
    </RaisedButton>
);
const FindButton = (props: ITypingBox) => (
    <RaisedButton primary={true} label="Find Team" onClick={props.onFindTeam}>
    </RaisedButton>
);

interface ITypingBox {
    onCreateTeam: () => void;
    onFindTeam: () => void;
    team_name: string;
    onNameChange: (e, text) => void;
}

export const TeamCreateView = (props: ITypingBox) => {
    return (
        < MuiThemeProvider >
            <Flexbox flexDirection="column" alignItems='center' justifyContent='center' >
                <h3>Create a new team</h3>
                <TextField hintText="Team name" value={props.team_name} onChange={props.onNameChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onCreateTeam();
                }} />
                <span style={styles.span} />
                <SubmitButton {...props} />
                <span style={styles.span} />

                <Flexbox flexDirection="row" alignItems='center' justifyContent='center' >
                    <p>Looking for existing team?</p>
                    <span style={styles.span} />
                    <FindButton {...props} />
                </Flexbox>
            </Flexbox>
        </MuiThemeProvider >
    );
}