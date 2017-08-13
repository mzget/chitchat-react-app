import * as React from "react";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import NavigationChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import MenuItem from "material-ui/MenuItem";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "material-ui/Toolbar";
import * as Colors from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { defaultMuiTheme } from "../utils/";
export const SimpleToolbar = (props) => (<MuiThemeProvider muiTheme={defaultMuiTheme}>
        <Toolbar>
            <ToolbarGroup firstChild={true}>
                {(props.onBackPressed)
    ? <IconButton onClick={props.onBackPressed}>
                            <NavigationChevronLeft color={Colors.darkWhite}/>
                        </IconButton>
    : <span style={{ margin: 8 }}/>}
                <MenuItem primaryText={props.title} style={{ color: Colors.white }} onClick={props.onPressTitle}/>
            </ToolbarGroup>
            <ToolbarGroup>
                {(props.groupItem) ? (<ToolbarGroup>
                            {props.groupItem}
                        </ToolbarGroup>) : null}
                <ToolbarSeparator />
                {(props.menus && props.menus.length > 0) ?
    (<IconMenu iconButtonElement={<IconButton>
                                        <NavigationExpandMoreIcon color={Colors.darkWhite}/>
                                    </IconButton>} anchorOrigin={{ horizontal: "right", vertical: "top" }} targetOrigin={{ horizontal: "right", vertical: "top" }}>
                                {props.menus.map((value, i, arr) => {
        return <MenuItem key={i} primaryText={value} onClick={() => props.onSelectedMenuItem(i, value)}/>;
    })}
                            </IconMenu>) : null}
            </ToolbarGroup>
        </Toolbar>
    </MuiThemeProvider>);
