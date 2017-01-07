import * as React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import { imagesPath } from '../consts/StickerPath';

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

interface IGridListProps {
    onSelected: () => void;
}

/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
const GridListExampleSimple = (props) => (
    <MuiThemeProvider>
        <div style={styles.root}>
            <GridList cols={4} cellHeight='auto' style={styles.gridList} >
                <Subheader>Subheader</Subheader>
                {
                    imagesPath.map((tile, i, arr) => (
                        <GridTile key={i}>
                            <img src={tile.img} onClick={props.onSelected} style={{ width: '50%', maxWidth: '128px' }} />
                        </GridTile>
                    ))}
            </GridList>
        </div>
    </MuiThemeProvider>
);

export default GridListExampleSimple;