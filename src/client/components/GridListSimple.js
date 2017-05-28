import * as React from "react";
import { GridList, GridTile } from "material-ui/GridList";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Subheader from "material-ui/Subheader";
const styles = (props) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        backgroundColor: "white",
        height: props.boxHeight
    },
    gridList: {
        overflowX: "hidden"
    },
});
/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
const GridListSimple = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement("div", { style: styles(props).root, id: "sticker_box" },
        React.createElement(GridList, { cols: 4, cellHeight: "auto", style: styles(props).gridList },
            React.createElement(Subheader, null, props.subheader),
            props.srcs.map((tile, i, arr) => (React.createElement(GridTile, { key: i },
                React.createElement("img", { src: tile.img, onClick: () => props.onSelected(i), style: { width: "50%", maxWidth: "128px" } }))))))));
export default GridListSimple;
