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

const SubmitButton = (props: ITypingBox) => (
    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} style={styles.button}>
    </RaisedButton>
);

interface ITypingBox {
    onSubmit: () => void;
    team_name: string;
    onNameChange: (e, text) => void;
}

export const TeamCreateView = (props: ITypingBox) => {
    return (
        < MuiThemeProvider >
            <Flex flexColumn align='center' justify='center' >
                <Box p={2} flexAuto></Box>
                <div>
                    <h3>Create a new team</h3>
                    <TextField hintText="team name" errorText="This field is required" value={props.team_name} onChange={props.onNameChange} onKeyDown={(e) => {
                        if (e.key === 'Enter') props.onSubmit();
                    } } />
                    <span style={styles.span} />
                    <SubmitButton {...props} />
                    <span style={styles.span} />
                </div>
                <Box p={2} flexAuto></Box>
            </Flex>
        </MuiThemeProvider >
    );
}