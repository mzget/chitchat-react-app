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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var React = require("react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var CircularProgress_1 = require("material-ui/CircularProgress");
var GoogleMap_1 = require("../../components/Maps/GoogleMap");
var MapBox = (function (_super) {
    __extends(MapBox, _super);
    function MapBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapBox.prototype.componentWillMount = function () {
        this.state = {
            marker: {
                position: {
                    lat: 13,
                    lng: 100
                },
                key: "",
                defaultAnimation: 2
            },
            mapReady: false
        };
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.geoSuccess = this.geoSuccess.bind(this);
        this.geoError = this.geoError.bind(this);
        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
    };
    MapBox.prototype.geoSuccess = function (position) {
        var _this = this;
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var _marker = this.state.marker;
        _marker.position = { lat: latitude, lng: longitude };
        this.setState(function (prev) { return (__assign({}, prev, { mapReady: true, marker: _marker })); }, function () { return _this.props.onLocationChange(_this.state.marker.position); });
    };
    MapBox.prototype.geoError = function () {
        console.error("Unable to retrieve your location");
    };
    MapBox.prototype.handleMapLoad = function (map) { };
    MapBox.prototype.handleMapClick = function (event) {
        var _this = this;
        var _marker = this.state.marker;
        _marker.position = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        _marker.key = Date.now();
        this.setState({ marker: _marker }, function () { return _this.props.onLocationChange(_this.state.marker.position); });
    };
    MapBox.prototype.render = function () {
        return (React.createElement(MuiThemeProvider_1["default"], null,
            React.createElement("div", { id: "map" }, (this.state.mapReady) ? (React.createElement(GoogleMap_1.SimpleGoogleMap, { googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCURNR7kARZEaHUchdx3MpEkX1azVlEO1E", loadingElement: React.createElement("div", { style: { height: "100%" } },
                    React.createElement(CircularProgress_1["default"], null)), containerElement: React.createElement("div", { style: { height: 400, width: 400 } }), mapElement: React.createElement("div", { style: { height: "100%" } }), onMapLoad: this.handleMapLoad, onMapClick: this.handleMapClick, marker: this.state.marker })) : React.createElement(CircularProgress_1["default"], null))));
    };
    return MapBox;
}(React.Component));
exports.MapBox = MapBox;
