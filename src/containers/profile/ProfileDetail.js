import * as React from "react";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { RaisedButton, TextField } from "material-ui";
import Avatar from "material-ui/Avatar";
import Subheader from 'material-ui/Subheader';
import * as FileReaderInput from "react-file-reader-input";
const Styles = require("../../styles/generalStyles");
const PageBox = Styles.generalStyles.pageBox;
const PaddingZero = Styles.generalStyles.paddingZero;
const styles = {
    span: {
        padding: 8
    },
    spanGap: {
        height: 8
    },
    avatar: {
        margin: 5
    },
    label: {
        marginLeft: 5,
        marginTop: 10
    },
    textBox: {
        marginRight: 5,
        marginLeft: 5
    }
};
const getDetailHeight = () => {
    return document.documentElement.clientHeight - (56 + 48);
};
export const ProfileDetail = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(Flexbox, { style: { backgroundColor: Colors.blueGrey50 }, flexDirection: "column", minHeight: "calc(100vh - 56px)", id: "ProfileDetail" },
        React.createElement(Flexbox, { flexDirection: "column", alignItems: "center", flexGrow: 1 },
            React.createElement(Subheader, null, "Edit your profile"),
            React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: (props.onFileReaderChange) ? props.onFileReaderChange : () => { } },
                React.createElement(Avatar, { src: props.user.avatar, size: 96, style: styles.avatar })),
            React.createElement("span", { style: styles.spanGap }),
            React.createElement(Flexbox, { flexDirection: "column", style: { backgroundColor: Colors.darkWhite, margin: 5 } },
                React.createElement(Flexbox, { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, " First Name :"),
                    React.createElement(Flexbox, { flexGrow: 1 }),
                    React.createElement(TextField, { style: styles.textBox, hintText: "first_name", errorText: "This field is required", value: props.user.firstname, onChange: props.onFirstNameChange })),
                React.createElement(Flexbox, { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, "Last Name :"),
                    React.createElement(Flexbox, { flexGrow: 1 }),
                    React.createElement(TextField, { style: styles.textBox, hintText: "last_name", errorText: "This field is required", value: props.user.lastname, onChange: props.onLastNameChange })),
                React.createElement(Flexbox, { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, "Tel :"),
                    React.createElement(Flexbox, { flexGrow: 1 }),
                    React.createElement(TextField, { style: styles.textBox, hintText: "tel", value: props.user.tel, onChange: props.onTelNumberChange })),
                React.createElement(Flexbox, { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, "Email :"),
                    React.createElement(Flexbox, { flexGrow: 1 }),
                    React.createElement(TextField, { style: styles.textBox, hintText: "email", value: props.user.email, disabled: true })),
                React.createElement(Flexbox, { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, "User Role :"),
                    React.createElement(Flexbox, { flexGrow: 1 }),
                    React.createElement(TextField, { style: styles.textBox, hintText: "user_role", value: props.teamProfile.team_role, disabled: true })),
                React.createElement(Flexbox, { flexDirection: "row" },
                    React.createElement("p", { style: styles.label }, "User Status :"),
                    React.createElement(Flexbox, { flexGrow: 1 }),
                    React.createElement(TextField, { style: styles.textBox, hintText: "user_status", value: props.user.status, disabled: true }))),
            React.createElement("span", { style: styles.spanGap })),
        React.createElement(Flexbox, { justifyContent: "flex-end" },
            React.createElement(RaisedButton, { primary: true, label: "submit", onClick: props.onSubmit, style: { margin: "2%" } })))));
