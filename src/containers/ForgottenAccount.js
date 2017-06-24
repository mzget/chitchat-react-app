import * as React from 'react';
import { SimpleToolbar } from "../components/SimpleToolbar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { Card, CardActions, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import Flexbox from 'flexbox-react';
export class ForgotAccount extends React.Component {
    onBack() {
        this.props.history.replace("/");
    }
    render() {
        return (React.createElement(MuiThemeProvider, null,
            React.createElement("div", { style: { overflow: "hidden" } },
                React.createElement(SimpleToolbar, { title: "ChitChat team communication.", onBackPressed: this.onBack.bind(this) }),
                React.createElement("div", { style: { overflow: "hidden", backgroundColor: Colors.indigo50 } },
                    React.createElement(Flexbox, { flexDirection: "row", justifyContent: "center", alignItems: "center", minHeight: "90vh" },
                        React.createElement(Card, { style: { width: 400 } },
                            React.createElement(Subheader, { style: { color: Colors.black, fontSize: 16 } }, "Find Your Account"),
                            React.createElement(Divider, { inset: false }),
                            React.createElement(CardText, null, "Please enter your email address to search for your account."),
                            React.createElement(TextField, { hintText: "Email address", style: { paddingLeft: 15 }, value: "", onChange: () => { }, onKeyDown: () => { } }),
                            React.createElement(CardActions, null,
                                React.createElement(FlatButton, { label: "Search", primary: true }),
                                React.createElement(FlatButton, { label: "Cancel", onClick: this.onBack.bind(this) })))),
                    React.createElement(Flexbox, { element: "footer", justifyContent: "center", maxHeight: "10vh", style: { backgroundColor: Colors.indigo50 } },
                        React.createElement("span", null,
                            React.createElement("b", null, "Powered by Stalk realtime communication API.")))))));
    }
}
