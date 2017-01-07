"use strict";
const React = require("react");
const GridList_1 = require("material-ui/GridList");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const Subheader_1 = require("material-ui/Subheader");
const StickerPath_1 = require("../consts/StickerPath");
const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        // width: 500,
        // height: 450,
        overflowY: 'hidden',
        overflowX: 'hidden'
    },
};
/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
const GridListExampleSimple = (props) => (React.createElement(MuiThemeProvider_1.default, null,
    React.createElement("div", { style: styles.root },
        React.createElement(GridList_1.GridList, { cols: 4, cellHeight: 'auto', style: styles.gridList },
            React.createElement(Subheader_1.default, null, "Subheader"),
            StickerPath_1.imagesPath.map((tile, i, arr) => (React.createElement(GridList_1.GridTile, { key: i },
                React.createElement("img", { src: tile.img, onClick: props.onSelected, style: { width: '50%', maxWidth: '128px' } }))))))));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GridListExampleSimple;
