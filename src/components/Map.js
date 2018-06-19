import React from 'react';
import _ from "lodash";
import { compose, withProps, withStateHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";

const Map = compose(
    withStateHandlers(() => ({
        isOpen: false,
      }), {
        onToggleOpen: ({ isOpen }) => () => ({
          isOpen: !isOpen,
        })
      }),
    withProps({
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `600px` }} />,
      mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
  )(props => (
    <GoogleMap defaultZoom={15} defaultCenter={{ lat: -22.8802213, lng: -43.3493468 }}>
      <Marker position={{ lat: -22.8785278, lng: -43.3574742 }}
        onClick={props.onToggleOpen}
      >
      {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
       <span>Academia Body Coach</span>
      </InfoWindow>}
      </Marker>
     
    </GoogleMap>
  ));
  
  const enhance = _.identity;
  
  const ReactGoogleMaps = () => [   
    <Map key="map" />
  ];
  
  export default enhance(ReactGoogleMaps);