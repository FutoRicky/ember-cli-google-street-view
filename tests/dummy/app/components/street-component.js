/*global google*/
import Ember from 'ember';
import layout from '../templates/components/street-component';

export default Ember.Component.extend({
  layout: layout,
  lat: 18.4662676,
  lng: -66.094726,
  height: "600px",
  width: "100%",
  zoom:0,
  pov: {
  	heading: 165,
  	pitch: 0
  },
  latLng: new google.maps.LatLng(18.4662676,-66.094726),

  panoChanged: function(){
  	Ember.Logger.debug('pano_changed happened');
  },

  linksChanged: function(){
  	Ember.Logger.debug('links_changed happened');
  },

  positionChanged: function(){
  	Ember.Logger.debug('position_changed happened');
  },

  povChanged: function(){
  	Ember.Logger.debug('pov_changed happened');
  }
});
