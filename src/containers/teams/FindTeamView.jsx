"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var material_ui_1 = require("material-ui");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var styles = {
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
var FindButton = function (props) { return (<material_ui_1.RaisedButton primary={true} label="Find Now" onClick={props.onSubmit}>
    </material_ui_1.RaisedButton>); };
var CreateNewButton = function (props) { return (<material_ui_1.RaisedButton primary={true} label="Create New" onClick={props.onCreateNewPress}>
    </material_ui_1.RaisedButton>); };
exports.FindTeamView = function (props) {
    return (<MuiThemeProvider_1.default>
            <reflexbox_1.Flex flexColumn align='center' justify='center'>
                <h3>Find your team</h3>
                <material_ui_1.TextField hintText="Enter your team name" value={props.team_name} onChange={props.onNameChange} onKeyDown={function (e) {
        if (e.key === 'Enter')
            props.onSubmit();
    }}/>
                <span style={styles.span}/>
                <FindButton {...props}/>
                <span style={styles.span}/>

                <reflexbox_1.Flex flexColumn={false} align='center' justify='center'>
                    <p>Create new team?</p>
                    <span style={styles.span}/>
                    <CreateNewButton {...props}/>
                </reflexbox_1.Flex>
            </reflexbox_1.Flex>
        </MuiThemeProvider_1.default>);
};
