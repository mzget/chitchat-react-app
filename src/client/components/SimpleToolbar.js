"use strict";
const React = require("react");
const IconMenu_1 = require("material-ui/IconMenu");
const IconButton_1 = require("material-ui/IconButton");
const expand_more_1 = require("material-ui/svg-icons/navigation/expand-more");
const MenuItem_1 = require("material-ui/MenuItem");
const Toolbar_1 = require("material-ui/Toolbar");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
class SimpleToolbar extends React.Component {
    componentWillMount() {
        this.state = {
            openState: false
        };
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement(Toolbar_1.Toolbar, null,
                React.createElement(Toolbar_1.ToolbarTitle, { text: this.props.title }),
                (this.props.menus && this.props.menus.length > 0) ?
                    (React.createElement(Toolbar_1.ToolbarGroup, null,
                        React.createElement(Toolbar_1.ToolbarSeparator, null),
                        React.createElement(IconMenu_1.default, { iconButtonElement: React.createElement(IconButton_1.default, { onClick: () => this.setState({ openState: !this.state.openState }) },
                                React.createElement(expand_more_1.default, null)), anchorOrigin: { horizontal: 'right', vertical: 'top' }, targetOrigin: { horizontal: 'right', vertical: 'top' }, onRequestChange: (open, reason) => this.setState({ openState: open }), onItemTouchTap: (event, child) => console.log('item touch tap', event, child), onTouchTap: (event) => console.log("ontouch tap", event), open: this.state.openState }, this.props.menus.map((value, i, arr) => {
                            return React.createElement(MenuItem_1.default, { key: i, primaryText: value, onClick: () => this.props.onSelectedMenuItem(i, value) });
                        })))) : null)));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SimpleToolbar;
