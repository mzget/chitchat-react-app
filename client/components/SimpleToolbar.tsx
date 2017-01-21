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
    menus: string[];
    onSelectedMenuItem: (id, value) => void;
}

interface IComponentState {
    openState: boolean;
}

class SimpleToolbar extends React.Component<IComponentProps, IComponentState> {
    componentWillMount() {
        this.state = {
            openState: false
        }
    }

    render() {
        return (
            <MuiThemeProvider>
                <Toolbar>
                    <ToolbarTitle text={this.props.title} />
                    {
                        (this.props.menus && this.props.menus.length > 0) ?
                            (
                                <ToolbarGroup>
                                    <ToolbarSeparator />
                                    <IconMenu
                                        iconButtonElement={
                                            <IconButton
                                                onClick={() => this.setState({ openState: !this.state.openState })}
                                                >
                                                <NavigationExpandMoreIcon />
                                            </IconButton>
                                        }
                                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        onRequestChange={(open, reason) => this.setState({ openState: open })}
                                        onItemTouchTap={(event, child) => console.log('item touch tap', event, child)}
                                        onTouchTap={(event) => console.log("ontouch tap", event)}
                                        open={this.state.openState}
                                        >
                                        {this.props.menus.map((value, i, arr) => {
                                            return <MenuItem key={i} primaryText={value} onClick={() => this.props.onSelectedMenuItem(i, value)} />
                                        })}
                                    </IconMenu>
                                </ToolbarGroup>
                            ) : null
                    }
                </Toolbar>
            </MuiThemeProvider>
        );
    }
}

export default SimpleToolbar;