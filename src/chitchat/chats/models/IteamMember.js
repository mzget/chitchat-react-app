"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var User_1 = require("./User");
var ITeamMember = (function (_super) {
    __extends(ITeamMember, _super);
    function ITeamMember() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ITeamMember;
}(User_1.ChitChatAccount));
exports.ITeamMember = ITeamMember;
