"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reflexbox_1 = require("reflexbox");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Colors = require("material-ui/styles/colors");
const material_ui_1 = require("material-ui");
const SelectField_1 = require("material-ui/SelectField");
const MenuItem_1 = require("material-ui/MenuItem");
const styles = {
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
const SubmitButton = (props) => (React.createElement(material_ui_1.RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }));
const ChartLevel = (props) => (React.createElement(SelectField_1.default, { floatingLabelText: "Org Level", value: props.dropdownValue, onChange: props.dropdownChange }, (props.dropdownItems.length > 0) ?
    props.dropdownItems.map((value, id) => React.createElement(MenuItem_1.default, { key: id, value: id, primaryText: value })) : null));
exports.CreateOrgChartForm = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.indigo50 }, flexColumn: true, align: "center" },
        React.createElement(reflexbox_1.Box, { justify: "center", align: "center", p: 2 },
            React.createElement("h3", null, "Create new ORG chart")),
        React.createElement(material_ui_1.TextField, { hintText: "Name", errorText: "This field is required", value: props.orgChartName, onChange: props.onOrgChartNameChange, onKeyDown: (e) => {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(material_ui_1.TextField, { hintText: "Description", value: props.orgChart_description, onChange: props.onOrgChartDescriptionChange, onKeyDown: (e) => {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(ChartLevel, Object.assign({}, props)),
        React.createElement("span", { style: styles.span }),
        React.createElement(SubmitButton, Object.assign({}, props)))));
