
import getMuiTheme from "material-ui/styles/getMuiTheme";
import * as Colors from "material-ui/styles/colors";
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

export const defaultMuiTheme = getMuiTheme({
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
    tabs: {
        backgroundColor: Colors.indigo700,
    },
    badge: {
        primaryColor: Colors.red500
    }
});