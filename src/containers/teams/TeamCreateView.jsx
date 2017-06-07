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
var SubmitButton = function (props) { return (<material_ui_1.RaisedButton primary={true} label="Create Team" onClick={props.onCreateTeam}>
    </material_ui_1.RaisedButton>); };
var FindButton = function (props) { return (<material_ui_1.RaisedButton primary={true} label="Find Team" onClick={props.onFindTeam}>
    </material_ui_1.RaisedButton>); };
exports.TeamCreateView = function (props) {
    return (<MuiThemeProvider_1.default>
            <reflexbox_1.Flex flexColumn align='center' justify='center'>
                <h3>Create a new team</h3>
                <material_ui_1.TextField hintText="Team name" value={props.team_name} onChange={props.onNameChange} onKeyDown={function (e) {
        if (e.key === 'Enter')
            props.onCreateTeam();
    }}/>
                <span style={styles.span}/>
                <SubmitButton {...props}/>
                <span style={styles.span}/>

                <reflexbox_1.Flex flexColumn={false} align='center' justify='center'>
                    <p>Looking for existing team?</p>
                    <span style={styles.span}/>
                    <FindButton {...props}/>
                </reflexbox_1.Flex>
            </reflexbox_1.Flex>
        </MuiThemeProvider_1.default>);
};
