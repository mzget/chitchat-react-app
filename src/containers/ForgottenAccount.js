"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = require("react");
var SimpleToolbar_1 = require("../components/SimpleToolbar");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Colors = require("material-ui/styles/colors");
var Card_1 = require("material-ui/Card");
var FlatButton_1 = require("material-ui/FlatButton");
var Divider_1 = require("material-ui/Divider");
var TextField_1 = require("material-ui/TextField");
var Subheader_1 = require("material-ui/Subheader");
var flexbox_react_1 = require("flexbox-react");
var ForgotAccount = (function (_super) {
    __extends(ForgotAccount, _super);
    function ForgotAccount() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForgotAccount.prototype.onBack = function () {
        this.props.history.replace("/");
    };
    ForgotAccount.prototype.render = function () {
        return (React.createElement(MuiThemeProvider_1["default"], null,
            React.createElement("div", { style: { overflow: "hidden" } },
                React.createElement(SimpleToolbar_1.SimpleToolbar, { title: "ChitChat team communication.", onBackPressed: this.onBack.bind(this) }),
                React.createElement("div", { style: { overflow: "hidden", backgroundColor: Colors.indigo50 } },
                    React.createElement(flexbox_react_1["default"], { flexDirection: "row", justifyContent: "center", alignItems: "center", minHeight: "90vh" },
                        React.createElement(Card_1.Card, { style: { width: 400 } },
                            React.createElement(Subheader_1["default"], { style: { color: Colors.black, fontSize: 16 } }, "Find Your Account"),
                            React.createElement(Divider_1["default"], { inset: false }),
                            React.createElement(Card_1.CardText, null, "Please enter your email address to search for your account."),
                            React.createElement(TextField_1["default"], { hintText: "Email address", style: { paddingLeft: 15 }, value: "", onChange: function () { }, onKeyDown: function () { } }),
                            React.createElement(Card_1.CardActions, null,
                                React.createElement(FlatButton_1["default"], { label: "Search", primary: true }),
                                React.createElement(FlatButton_1["default"], { label: "Cancel", onClick: this.onBack.bind(this) })))),
                    React.createElement(flexbox_react_1["default"], { element: "footer", justifyContent: "center", maxHeight: "10vh", style: { backgroundColor: Colors.indigo50 } },
                        React.createElement("span", null,
                            React.createElement("b", null, "Powered by Stalk realtime communication API.")))))));
    };
    return ForgotAccount;
}(React.Component));
exports.ForgotAccount = ForgotAccount;
