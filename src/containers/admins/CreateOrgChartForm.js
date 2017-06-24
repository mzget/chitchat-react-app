import * as React from "react";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, TextField } from "material-ui";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
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
const SubmitButton = (props) => (React.createElement(RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit }));
const ChartLevel = (props) => (React.createElement(SelectField, { floatingLabelText: "Org Level", value: props.dropdownValue, onChange: props.dropdownChange }, (props.dropdownItems.length > 0) ?
    props.dropdownItems.map((value, id) => React.createElement(MenuItem, { key: id, value: id, primaryText: value })) : null));
export const CreateOrgChartForm = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(Flexbox, { style: { backgroundColor: Colors.darkWhite }, width: "100%", flexDirection: "column", alignItems: "center" },
        React.createElement(Flexbox, { justifyContent: "center", alignItems: "center" },
            React.createElement("h3", null, "Create new ORG chart")),
        React.createElement(TextField, { hintText: "Name", errorText: "This field is required", value: props.orgChartName, onChange: props.onOrgChartNameChange, onKeyDown: (e) => {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(TextField, { hintText: "Description", value: props.orgChart_description, onChange: props.onOrgChartDescriptionChange, onKeyDown: (e) => {
                if (e.key === "Enter")
                    props.onSubmit();
            } }),
        React.createElement("span", { style: styles.span }),
        React.createElement(ChartLevel, Object.assign({}, props)),
        React.createElement("span", { style: styles.span }),
        React.createElement(SubmitButton, Object.assign({}, props)))));
