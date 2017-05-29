"use strict";
var React = require("react");
var GridList_1 = require("material-ui/GridList");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Subheader_1 = require("material-ui/Subheader");
var styles = function (props) { return ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        backgroundColor: "white",
        height: props.boxHeight
    },
    gridList: {
        overflowX: "hidden"
    }
}); };
/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
var GridListSimple = function (props) { return (React.createElement(MuiThemeProvider_1["default"], null,
    React.createElement("div", { style: styles(props).root, id: "sticker_box" },
        React.createElement(GridList_1.GridList, { cols: 4, cellHeight: "auto", style: styles(props).gridList },
            React.createElement(Subheader_1["default"], null, props.subheader),
            props.srcs.map(function (tile, i, arr) { return (React.createElement(GridList_1.GridTile, { key: i },
                React.createElement("img", { src: tile.img, onClick: function () { return props.onSelected(i); }, style: { width: "50%", maxWidth: "128px" } }))); }))))); };
exports.__esModule = true;
exports["default"] = GridListSimple;
