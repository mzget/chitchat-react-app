"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var Colors = require("material-ui/styles/colors");
exports.WarningBar = function () { return (<div id={"warning_bar"}>
        <reflexbox_1.Flex style={{ backgroundColor: Colors.red500 }} align="center" justify="center" flexColumn={true}>
            <reflexbox_1.Flex flexColumn={true}>
                <span style={{ color: Colors.white, fontSize: 14 }}>Unable to connect whit chat service.</span>
                <span style={{ color: Colors.white, fontSize: 14 }}>Check your Internet connection.</span>
            </reflexbox_1.Flex>
        </reflexbox_1.Flex>
    </div>); };
