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
var GridListSimple = function (props) { return (<MuiThemeProvider_1.default>
        <div style={styles(props).root} id={"sticker_box"}>
            <GridList_1.GridList cols={4} cellHeight="auto" style={styles(props).gridList}>
                <Subheader_1.default>{props.subheader}</Subheader_1.default>
                {props.srcs.map(function (tile, i, arr) { return (<GridList_1.GridTile key={i}>
                            <img src={tile.img} onClick={function () { return props.onSelected(i); }} style={{ width: "50%", maxWidth: "128px" }}/>
                        </GridList_1.GridTile>); })}
            </GridList_1.GridList>
        </div>
    </MuiThemeProvider_1.default>); };
exports.__esModule = true;
exports["default"] = GridListSimple;
