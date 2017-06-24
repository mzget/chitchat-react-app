/* global google */
import * as React from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import CircularProgress from 'material-ui/CircularProgress';
/*
 * Sample From: https://developers.google.com/maps/documentation/javascript/examples/map-simple
 */
const SimpleGoogleMap = withScriptjs(withGoogleMap((props) => (<GoogleMap defaultZoom={15} defaultCenter={props.marker.position}>
    {(props.marker) ? <Marker {...props.marker}/> : null}
  </GoogleMap>)));
/*
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 */
export class SimpleMapPreview extends React.Component {
    render() {
        return (<MuiThemeProvider>
        <div>
          <SimpleGoogleMap googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyCURNR7kARZEaHUchdx3MpEkX1azVlEO1E" loadingElement={<div style={{ height: `100%` }}>
                <CircularProgress />
              </div>} containerElement={<div style={{ width: 300, height: 300 }}/>} mapElement={<div style={{ height: `100%` }}/>} marker={this.props.marker}/>
        </div>
      </MuiThemeProvider>);
    }
}
