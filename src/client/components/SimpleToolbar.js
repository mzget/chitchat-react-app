"use strict";
const React = require("react");
const IconMenu_1 = require("material-ui/IconMenu");
const IconButton_1 = require("material-ui/IconButton");
const expand_more_1 = require("material-ui/svg-icons/navigation/expand-more");
const MenuItem_1 = require("material-ui/MenuItem");
const Toolbar_1 = require("material-ui/Toolbar");
const Colors = require("material-ui/styles/colors");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
const muiTheme = getMuiTheme_1.default({
    palette: {
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.darkWhite,
        primary1Color: Colors.indigo200,
        primary2Color: Colors.indigo700,
        accent1Color: Colors.redA200,
        pickerHeaderColor: Colors.darkBlack,
    },
    toolbar: {
        color: Colors.white,
        backgroundColor: Colors.indigo500,
    },
});
class SimpleToolbar extends React.Component {
    componentWillMount() {
        this.state = {
            openState: false
        };
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, { muiTheme: muiTheme },
            React.createElement(Toolbar_1.Toolbar, null,
                React.createElement(Toolbar_1.ToolbarGroup, { firstChild: true },
                    (this.props.onBackPressed) ?
                        React.createElement(IconButton_1.default, { iconClassName: "material-icons", onClick: this.props.onBackPressed }, "chevron_left")
                        :
                            React.createElement("span", { style: { margin: 8 } }),
                    React.createElement(Toolbar_1.ToolbarTitle, { text: this.props.title, style: { color: Colors.white } })),
                (this.props.menus && this.props.menus.length > 0) ?
                    (React.createElement(Toolbar_1.ToolbarGroup, null,
                        React.createElement(Toolbar_1.ToolbarSeparator, null),
                        React.createElement(IconMenu_1.default, { iconButtonElement: React.createElement(IconButton_1.default, null,
                                React.createElement(expand_more_1.default, null)), anchorOrigin: { horizontal: "right", vertical: "top" }, targetOrigin: { horizontal: "right", vertical: "top" }, onRequestChange: (open, reason) => this.setState({ openState: open }), onItemTouchTap: (event, child) => console.log("onItemTouchTap"), onTouchTap: (event) => console.log("onTouchTap"), open: this.state.openState }, this.props.menus.map((value, i, arr) => {
                            return React.createElement(MenuItem_1.default, { key: i, primaryText: value, onTouchTap: () => this.props.onSelectedMenuItem(i, value) });
                        })))) : null)));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleToolbar;
