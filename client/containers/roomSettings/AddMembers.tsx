import * as React from 'react';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

export const AddMembers = () => (
    <MuiThemeProvider>
        <TextField
            hintText="Enter name or email address"
        />
    </MuiThemeProvider>
);