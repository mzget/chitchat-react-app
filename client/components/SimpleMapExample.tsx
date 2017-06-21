/* global google */
import * as React from "react";

import {
  withGoogleMap,
  GoogleMap,
} from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import CircularProgress from 'material-ui/CircularProgress';

/*
 * Sample From: https://developers.google.com/maps/documentation/javascript/examples/map-simple
 */
const SimpleMapExampleGoogleMap = withScriptjs(withGoogleMap(props => (
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  />
)));

/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export default class SimpleMapExample extends React.Component<any, any> {

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <SimpleMapExampleGoogleMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCURNR7kARZEaHUchdx3MpEkX1azVlEO1E"
            loadingElement={
              <div style={{ height: `100%` }}>
                <CircularProgress />
              </div>
            }
            containerElement={
              <div style={{ width: 100, height: 100 }} />
            }
            mapElement={
              <div style={{ height: `100%` }} />
            }
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
