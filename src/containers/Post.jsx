"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var reflexbox_1 = require("reflexbox");
var Subheader_1 = require("material-ui/Subheader");
var Colors = require("material-ui/styles/colors");
var Post = (function (_super) {
    __extends(Post, _super);
    function Post() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.headerHeight = 56;
        _this.footerHeight = 24;
        return _this;
    }
    Post.prototype.render = function () {
        return (<div style={{ overflow: "hidden" }}>
                <div id={"app_body"} style={{ backgroundColor: Colors.indigo50 }}>
                    <Subheader_1.default>Feeds</Subheader_1.default>
                    <reflexbox_1.Flex flexColumn={true}>
                        <reflexbox_1.Flex align="center">
                            <reflexbox_1.Box p={2} flexAuto></reflexbox_1.Box>
                            <reflexbox_1.Box p={2} flexAuto></reflexbox_1.Box>
                        </reflexbox_1.Flex>
                        <reflexbox_1.Box flexAuto justify="flex-end"></reflexbox_1.Box>
                    </reflexbox_1.Flex>
                </div>
                <div id={"app_footer"} style={{
            height: this.footerHeight,
            fontSize: 16, textAlign: "center", backgroundColor: Colors.indigo50
        }}>
                    <reflexbox_1.Flex px={2} align="center" justify="center">
                        <span>Powered by Stalk realtime messaging service.</span>
                    </reflexbox_1.Flex>
                </div>
            </div>);
    };
    return Post;
}(React.Component));
exports.Post = Post;
