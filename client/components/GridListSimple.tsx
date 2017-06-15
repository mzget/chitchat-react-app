import * as React from "react";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { GridList, GridTile } from "material-ui/GridList";
import IconButton from "material-ui/IconButton";
import Subheader from "material-ui/Subheader";

const styles = {
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        backgroundColor: "white"
    }
};

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
        <Flexbox style={{ backgroundColor: Colors.indigo50 }} id={"sticker_box"}>
            <GridList cols={4} cellHeight={100} style={{ height: 208, width: "400px", overflowY: "scroll" }}>
                <Subheader>{props.subheader}</Subheader>
                {
                    props.srcs.map((tile, i, arr) => (
                        <GridTile key={i}>
                            <img src={tile.img} onClick={() => props.onSelected(i)} style={{ width: "50%", maxWidth: "100px" }} />
                        </GridTile>
                    ))
                }
            </GridList>
        </Flexbox>
    </MuiThemeProvider >
);