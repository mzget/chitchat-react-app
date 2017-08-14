
import getMuiTheme from "material-ui/styles/getMuiTheme";
import * as Colors from "material-ui/styles/colors";
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

export const defaultMuiTheme = getMuiTheme({
    palette: {
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.darkWhite,
        primary1Color: Colors.lightBlue700,
        primary2Color: Colors.lightBlue100,
        primary3Color: Colors.lightBlue500,
        accent1Color: Colors.redA200,
        pickerHeaderColor: Colors.darkBlack,
    },
    toolbar: {
        color: Colors.white,
        backgroundColor: Colors.lightBlue900,
    },
    tabs: {
        backgroundColor: Colors.indigo500,
    },
    badge: {
        primaryColor: Colors.red500
    }
});