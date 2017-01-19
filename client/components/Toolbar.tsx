import * as React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

interface IComponentProps {
    title: string;
}

const SimpleToolbar = (props: IComponentProps) => (
    <MuiThemeProvider>
        <Toolbar>
            <ToolbarTitle text={props.title} />
            <ToolbarGroup>
                <ToolbarSeparator />
                <IconMenu
                    iconButtonElement={
                        <IconButton touch={true}>
                            <NavigationExpandMoreIcon />
                        </IconButton>
                    }
                    >
                    <MenuItem primaryText="Download" />
                    <MenuItem primaryText="More Info" />
                </IconMenu>
            </ToolbarGroup>
        </Toolbar>
    </MuiThemeProvider>
);

export default SimpleToolbar;