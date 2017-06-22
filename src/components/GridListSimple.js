import * as React from "react";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { GridList, GridTile } from "material-ui/GridList";
import Subheader from "material-ui/Subheader";
const styles = {
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        backgroundColor: "white"
    }
};
/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
export const GridListSimple = (props) => (React.createElement(MuiThemeProvider, null,
    React.createElement(Flexbox, { style: { backgroundColor: Colors.indigo50 }, id: "sticker_box" },
        React.createElement(GridList, { cols: 4, cellHeight: 100, style: { height: 208, width: "400px", overflowY: "scroll" } },
            React.createElement(Subheader, null, props.subheader),
            props.srcs.map((tile, i, arr) => (React.createElement(GridTile, { key: i },
                React.createElement("img", { src: tile.img, onClick: () => props.onSelected(i), style: { width: "50%", maxWidth: "100px" } }))))))));
