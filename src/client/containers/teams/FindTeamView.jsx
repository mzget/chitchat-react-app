import * as React from "react";
import Flexbox from "flexbox-react";
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const FindButton = (props) => (<RaisedButton primary={true} label="Find" onClick={props.onSubmit} style={{ height: 40, margin: 4 }}>
    </RaisedButton>);
export const FindTeamView = (props) => {
    return (<MuiThemeProvider>
            <Flexbox flexDirection="column" alignItems='center' justifyContent='center'>
                <p>Join an existing team</p>
                <Flexbox flexDirection="row">
                    <TextField hintText="Enter a team name" value={props.team_name} onChange={props.onNameChange} onKeyDown={(e) => {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                    <FindButton {...props}/>
                </Flexbox>
            </Flexbox>
        </MuiThemeProvider>);
};
