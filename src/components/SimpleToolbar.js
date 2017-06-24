import * as React from "react";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import MenuItem from "material-ui/MenuItem";
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from "material-ui/Toolbar";
import * as Colors from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
const muiTheme = getMuiTheme({
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
export const SimpleToolbar = (props) => (React.createElement(MuiThemeProvider, { muiTheme: muiTheme },
    React.createElement(Toolbar, null,
        React.createElement(ToolbarGroup, { firstChild: true },
            (props.onBackPressed) ?
                React.createElement(IconButton, { iconClassName: "material-icons", onClick: props.onBackPressed }, "chevron_left")
                :
                    React.createElement("span", { style: { margin: 8 } }),
            React.createElement(ToolbarTitle, { text: props.title, style: { color: Colors.white }, onClick: props.onPressTitle })),
        React.createElement(ToolbarGroup, null,
            (props.groupItem) ? (React.createElement(ToolbarGroup, null, props.groupItem)) : null,
            React.createElement(ToolbarSeparator, null),
            (props.menus && props.menus.length > 0) ?
                (React.createElement(IconMenu, { iconButtonElement: React.createElement(IconButton, null,
                        React.createElement(NavigationExpandMoreIcon, null)), anchorOrigin: { horizontal: "right", vertical: "top" }, targetOrigin: { horizontal: "right", vertical: "top" } }, props.menus.map((value, i, arr) => {
                    return React.createElement(MenuItem, { key: i, primaryText: value, onClick: () => props.onSelectedMenuItem(i, value) });
                }))) : null))));
