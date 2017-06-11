import * as React from "react";
import { GridList, GridTile } from "material-ui/GridList";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import IconButton from "material-ui/IconButton";
import Subheader from "material-ui/Subheader";
import StarBorder from "material-ui/svg-icons/toggle/star-border";

const styles = (props) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        backgroundColor: "white"
    },
    gridList: {
        overflowX: "auto"
    },
});

interface IGridListProps {
    srcs: Array<{
        img: any,
    }>;
    onSelected: (id: number) => void;
    subheader?: string;
    boxHeight?: number;
}

/**
 * A simple example of a scrollable `GridList` containing a [Subheader](/#/components/subheader).
 */
export const GridListSimple = (props: IGridListProps) => (
    <MuiThemeProvider>
        <div id={"sticker_box"}>
            <GridList cols={4} cellHeight="auto" >
                <Subheader>{props.subheader}</Subheader>
                {
                    props.srcs.map((tile, i, arr) => (
                        <GridTile key={i}>
                            <img src={tile.img} onClick={() => props.onSelected(i)} style={{ width: "50%", maxWidth: "100px" }} />
                        </GridTile>
                    ))
                }
            </GridList>
        </div>
    </MuiThemeProvider >
);