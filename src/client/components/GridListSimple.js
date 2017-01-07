"use strict";
const React = require("react");
const GridList_1 = require("material-ui/GridList");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Subheader_1 = require("material-ui/Subheader");
const styles = (props) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        height: props.boxHeight
    },
    gridList: {
        overflowY: 'hidden',
        overflowX: 'hidden'
    },
});
/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
const GridListSimple = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", { style: styles(props).root },
        React.createElement(GridList_1.GridList, { cols: 4, cellHeight: 'auto', style: styles(props).gridList },
            React.createElement(Subheader_1.default, null, props.subheader),
            props.srcs.map((tile, i, arr) => (React.createElement(GridList_1.GridTile, { key: i },
                React.createElement("img", { src: tile.img, onClick: () => props.onSelected(i), style: { width: '50%', maxWidth: '128px' } }))))))));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GridListSimple;
