"use strict";
/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var stalk_js_1 = require("stalk-js");
var DataManager_1 = require("./DataManager");
var DataListener_1 = require("./DataListener");
var PushDataListener_1 = require("./PushDataListener");
var ChatslogComponent_1 = require("./ChatslogComponent");
var ServerEventListener_1 = require("./ServerEventListener");
var ChitchatFactory_1 = require("./ChitchatFactory");
var getConfig = function () { return ChitchatFactory_1.ChitChatFactory.getInstance().config; };
var BackendFactory = (function () {
    function BackendFactory() {
        console.log("BackendFactory:");
        this.pushDataListener = new PushDataListener_1.PushDataListener();
        this.dataManager = new DataManager_1.DataManager();
        this.dataListener = new DataListener_1.DataListener(this.dataManager);
    }
    BackendFactory.getInstance = function () {
        return BackendFactory.instance;
    };
    BackendFactory.createInstance = function () {
        if (!BackendFactory.instance) {
            BackendFactory.instance = new BackendFactory();
        }
        return BackendFactory.instance;
    };
    BackendFactory.prototype.getServer = function () {
        if (this.stalk._isConnected) {
            return this.stalk;
        }
        else {
            console.log("Stalk connection not yet ready.");
            return null;
        }
    };
    BackendFactory.prototype.stalkInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var socket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stalk = stalk_js_1.StalkFactory.create(getConfig().Stalk.chat, getConfig().Stalk.port);
                        return [4 /*yield*/, stalk_js_1.StalkFactory.init(this.stalk)];
                    case 1:
                        socket = _a.sent();
                        return [2 /*return*/, socket];
                }
            });
        });
    };
    BackendFactory.prototype.handshake = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, connector, params, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        msg = {};
                        msg["uid"] = uid;
                        msg["x-api-key"] = getConfig().Stalk.apiKey;
                        return [4 /*yield*/, stalk_js_1.StalkFactory.geteEnter(this.stalk, msg)];
                    case 1:
                        connector = _a.sent();
                        params = { host: connector.host, port: connector.port, reconnect: false };
                        return [4 /*yield*/, stalk_js_1.StalkFactory.handshake(this.stalk, params)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, connector];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        ex_1 = _a.sent();
                        throw new Error("handshake fail: " + ex_1.message);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    BackendFactory.prototype.checkIn = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msg = {};
                        msg["user"] = user;
                        msg["x-api-key"] = getConfig().Stalk.apiKey;
                        return [4 /*yield*/, stalk_js_1.StalkFactory.checkIn(this.stalk, msg)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    BackendFactory.prototype.checkOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, stalk_js_1.StalkFactory.checkOut(this.stalk)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @returns
     *
     * @memberof BackendFactory
     */
    BackendFactory.prototype.logout = function () {
        var self = this;
        var promise = new Promise(function exe(resolve, reject) {
            self.checkOut();
            if (!!self.pushDataListener) {
                self.pushDataListener = null;
            }
            if (!!self.dataManager) {
                self.dataManager = null;
            }
            if (!!self.dataListener) {
                self.dataListener = null;
            }
            BackendFactory.instance = null;
            resolve();
        });
        return promise;
    };
    BackendFactory.prototype.createChatlogs = function () {
        this.chatLogComp = new ChatslogComponent_1.ChatsLogComponent();
        return this.chatLogComp;
    };
    BackendFactory.prototype.getServerListener = function () {
        if (!this.serverEventsListener) {
            this.serverEventsListener = new ServerEventListener_1.ServerEventListener(this.stalk.getSocket());
        }
        return this.serverEventsListener;
    };
    BackendFactory.prototype.subscriptions = function () {
        this.serverEventsListener.addServerListener(this.dataListener);
        this.serverEventsListener.addChatListener(this.dataListener);
        this.serverEventsListener.addPushListener(this.pushDataListener);
    };
    return BackendFactory;
}());
exports.BackendFactory = BackendFactory;
