"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Colors = require("material-ui/styles/colors");
var material_ui_1 = require("material-ui");
var SelectField_1 = require("material-ui/SelectField");
var MenuItem_1 = require("material-ui/MenuItem");
var styles = {
    span: {
        padding: 8
    },
    box: {
        bottom: 0,
        position: "absolute"
    },
    customWidth: {
        width: 200,
        fontSize: 16
    }
};
var SubmitButton = function (props) { return (<material_ui_1.RaisedButton primary={true} label="submit" onClick={props.onSubmit}>
    </material_ui_1.RaisedButton>); };
var ChartLevel = function (props) { return (<SelectField_1.default floatingLabelText="Org Level" value={props.dropdownValue} onChange={props.dropdownChange}>
        {(props.dropdownItems.length > 0) ?
    props.dropdownItems.map(function (value, id) {
        return <MenuItem_1.default key={id} value={id} primaryText={value}/>;
    }) : null}
    </SelectField_1.default>); };
exports.CreateOrgChartForm = function (props) { return (<MuiThemeProvider_1.default>
        <reflexbox_1.Flex style={{ backgroundColor: Colors.indigo50 }} flexColumn align="center">
            <reflexbox_1.Box justify="center" align="center" p={2}>
                <h3>Create new ORG chart</h3>
            </reflexbox_1.Box>
            <material_ui_1.TextField hintText="Name" errorText="This field is required" value={props.orgChartName} onChange={props.onOrgChartNameChange} onKeyDown={function (e) {
    if (e.key === "Enter")
        props.onSubmit();
}}/>
            <span style={styles.span}/>
            <material_ui_1.TextField hintText="Description" value={props.orgChart_description} onChange={props.onOrgChartDescriptionChange} onKeyDown={function (e) {
    if (e.key === "Enter")
        props.onSubmit();
}}/>
            <span style={styles.span}/>
            <ChartLevel {...props}/>
            <span style={styles.span}/>
            <SubmitButton {...props}/>
        </reflexbox_1.Flex>
    </MuiThemeProvider_1.default>); };
