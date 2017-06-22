/* global google */
import * as React from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import CircularProgress from 'material-ui/CircularProgress';
/*
 * Sample From: https://developers.google.com/maps/documentation/javascript/examples/map-simple
 */
const SimpleGoogleMap = withScriptjs(withGoogleMap((props) => (React.createElement(GoogleMap, { defaultZoom: 15, defaultCenter: props.marker.position }, (props.marker) ? React.createElement(Marker, Object.assign({}, props.marker)) : null))));
/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export class SimpleMapPreview extends React.Component {
    render() {
        return (React.createElement(MuiThemeProvider, null,
            React.createElement("div", null,
                React.createElement(SimpleGoogleMap, { googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCURNR7kARZEaHUchdx3MpEkX1azVlEO1E", loadingElement: React.createElement("div", { style: { height: `100%` } },
                        React.createElement(CircularProgress, null)), containerElement: React.createElement("div", { style: { width: 300, height: 300 } }), mapElement: React.createElement("div", { style: { height: `100%` } }), marker: this.props.marker }))));
    }
}
