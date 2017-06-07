"use strict";
var React = require("react");
var IconMenu_1 = require("material-ui/IconMenu");
var IconButton_1 = require("material-ui/IconButton");
var expand_more_1 = require("material-ui/svg-icons/navigation/expand-more");
var MenuItem_1 = require("material-ui/MenuItem");
var Toolbar_1 = require("material-ui/Toolbar");
var Colors = require("material-ui/styles/colors");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var getMuiTheme_1 = require("material-ui/styles/getMuiTheme");
var muiTheme = getMuiTheme_1["default"]({
    palette: {
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.darkWhite,
        primary1Color: Colors.indigo200,
        primary2Color: Colors.indigo700,
        accent1Color: Colors.redA200,
        pickerHeaderColor: Colors.darkBlack
    },
    toolbar: {
        color: Colors.white,
        backgroundColor: Colors.indigo500
    }
});
exports.SimpleToolbar = function (props) { return (<MuiThemeProvider_1.default muiTheme={muiTheme} style={{ height: "56px" }}>
        <Toolbar_1.Toolbar>
            <Toolbar_1.ToolbarGroup firstChild={true}>
                {(props.onBackPressed) ?
    <IconButton_1.default iconClassName="material-icons" onClick={props.onBackPressed}>
                            chevron_left
                                </IconButton_1.default>
    :
        <span style={{ margin: 8 }}/>}
                <Toolbar_1.ToolbarTitle text={props.title} style={{ color: Colors.white }} onClick={props.onPressTitle}/>
            </Toolbar_1.ToolbarGroup>
            <Toolbar_1.ToolbarGroup>
                {(props.groupItem) ? (<Toolbar_1.ToolbarGroup>
                            {props.groupItem}
                        </Toolbar_1.ToolbarGroup>) : null}
                <Toolbar_1.ToolbarSeparator />
                {(props.menus && props.menus.length > 0) ?
    (<IconMenu_1.default iconButtonElement={<IconButton_1.default>
                                        <expand_more_1.default />
                                    </IconButton_1.default>} anchorOrigin={{ horizontal: "right", vertical: "top" }} targetOrigin={{ horizontal: "right", vertical: "top" }}>
                                {props.menus.map(function (value, i, arr) {
        return <MenuItem_1.default key={i} primaryText={value} onClick={function () { return props.onSelectedMenuItem(i, value); }}/>;
    })}
                            </IconMenu_1.default>) : null}
            </Toolbar_1.ToolbarGroup>
        </Toolbar_1.Toolbar>
    </MuiThemeProvider_1.default>); };
