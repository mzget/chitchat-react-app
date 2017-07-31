import * as React from "react";
import Flexbox from "flexbox-react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import { GridList, GridTile } from "material-ui/GridList";
import Subheader from "material-ui/Subheader";
import { small_body_width, large_body_width, LARGE } from '../chitchat/consts/Breakpoints';
const styles = {
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        backgroundColor: "white"
    }
};
export const GridListSimple = (props) => (<MuiThemeProvider>
        <Flexbox style={{ backgroundColor: Colors.indigo50 }} id={"sticker_box"}>
            <GridList cols={6} cellHeight={100} style={{ padding: 20, height: 208, width: window.innerWidth >= LARGE ? large_body_width : small_body_width, overflowY: "scroll" }}>
                <Subheader>{props.subheader}</Subheader>
                {props.srcs.map((tile, i, arr) => (<GridTile key={i}>
                            <img src={tile.img} onClick={() => props.onSelected(i)} style={{ width: "50%", maxWidth: "100px" }}/>
                        </GridTile>))}
            </GridList>
        </Flexbox>
    </MuiThemeProvider>);
