import * as React from "react";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";

export const WarningBar = () => (
    <div id={"warning_bar"}>
        <Flex style={{ backgroundColor: Colors.red500 }} align="center" justify="center" flexColumn={true}>
            <Flex flexColumn={true}>
                <span style={{ color: Colors.white, fontSize: 14 }}>Unable to connect whit chat service.</span>
                <span style={{ color: Colors.white, fontSize: 14 }}>Check your Internet connection.</span>
            </Flex>
        </Flex>
    </div>
);