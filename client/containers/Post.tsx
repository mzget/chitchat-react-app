import * as React from "react";
import { Flex, Box } from "reflexbox";
import Subheader from "material-ui/Subheader";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

export class Post extends React.Component<any, any> {
    headerHeight = 56;
    footerHeight = 24;
    render() {
        return (
            <div style={{ overflow: "hidden" }}>
                <div id={"app_body"} style={{ backgroundColor: Colors.indigo50 }}>
                    <Subheader>Feeds</Subheader>
                    <Flex flexColumn={true} >
                        <Flex align="center">
                            <Box p={2} flexAuto></Box>
                            <Box p={2} flexAuto></Box>
                        </Flex>
                        <Box flexAuto justify="flex-end"></Box>
                    </Flex>
                </div>
                <div id={"app_footer"} style={{
                    height: this.footerHeight,
                    fontSize: 16, textAlign: "center", backgroundColor: Colors.indigo50
                }}>
                    <Flex px={2} align="center" justify="center">
                        <span>Powered by Stalk realtime communication API.</span>
                    </Flex>
                </div>
            </div>
        );
    }
}
