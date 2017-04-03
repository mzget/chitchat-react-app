import * as React from "react";
import { Flex, Box } from 'reflexbox';
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
const FindButton = (props: ITypingBox) => (
    <RaisedButton primary={true} label="Find Now" onClick={props.onSubmit}>
    </RaisedButton>
);
const CreateNewButton = (props: ITypingBox) => (
    <RaisedButton primary={true} label="Create New" onClick={props.onCreateNewPress}>
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
            <Flex flexColumn align='center' justify='center' >
                <h3>Find your team</h3>
                <TextField hintText="Enter your team name" value={props.team_name} onChange={props.onNameChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } />
                <span style={styles.span} />
                <FindButton {...props} />
                <span style={styles.span} />

                <Flex flexColumn={false} align='center' justify='center' >
                    <p>Create new team?</p>
                    <span style={styles.span} />
                    <CreateNewButton {...props} />
                </Flex>
            </Flex>
        </MuiThemeProvider >
    );
}