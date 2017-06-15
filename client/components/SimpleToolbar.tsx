import * as React from "react";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import MenuItem from "material-ui/MenuItem";
import DropDownMenu from "material-ui/DropDownMenu";
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from "material-ui/Toolbar";
import * as Colors from "material-ui/styles/colors";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

const muiTheme = getMuiTheme({
    palette: {
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.darkWhite,
        primary1Color: Colors.indigo200,
        primary2Color: Colors.indigo700,
        accent1Color: Colors.redA200,
        pickerHeaderColor: Colors.darkBlack,
    },
    toolbar: {
        color: Colors.white,
        backgroundColor: Colors.indigo500,
    },
});

interface IComponentProps {
    title: string;
    onPressTitle?: (e) => void;
    menus?: string[];
    groupItem?: JSX.Element;
    onSelectedMenuItem?: (id, value) => void;
    onBackPressed?: () => void;
}

export const SimpleToolbar = (props: IComponentProps) => (
    <MuiThemeProvider muiTheme={muiTheme} >
        <Toolbar>
            <ToolbarGroup firstChild={true}>
                {
                    (props.onBackPressed) ?
                        <IconButton iconClassName="material-icons" onClick={props.onBackPressed}>
                            chevron_left
                                </IconButton>
                        :
                        <span style={{ margin: 8 }} />
                }
                <ToolbarTitle text={props.title} style={{ color: Colors.white }} onClick={props.onPressTitle} />
            </ToolbarGroup>
            <ToolbarGroup>
                {
                    (props.groupItem) ? (
                        <ToolbarGroup>
                            {props.groupItem}
                        </ToolbarGroup>
                    ) : null
                }
                <ToolbarSeparator />
                {
                    (props.menus && props.menus.length > 0) ?
                        (
                            <IconMenu
                                iconButtonElement={
                                    <IconButton>
                                        <NavigationExpandMoreIcon />
                                    </IconButton>
                                }
                                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                                targetOrigin={{ horizontal: "right", vertical: "top" }}
                            >
                                {
                                    props.menus.map((value, i, arr) => {
                                        return <MenuItem key={i} primaryText={value}
                                            onClick={() => props.onSelectedMenuItem(i, value)}
                                        />;
                                    })}
                            </IconMenu>
                        ) : null
                }
            </ToolbarGroup>
        </Toolbar>
    </MuiThemeProvider>
);