/* global google */
import Ember from 'ember';
import {
  moduleForComponent,
  test
} from 'ember-qunit';

function latRandomizer(){
  return (Math.random() * 181) - 90;
}

function lngRandomizer() {
  return (Math.random() * 281) -180;
}

moduleForComponent('street-view', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  let component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('that lat and lng are assigned properly', function ( assert ) {
  let lat = latRandomizer();
  let lng = lngRandomizer();

  let component = this.subject({
    lat: lat,
    lng: lng
  });
  this.render();

  assert.equal(component.lat.toFixed(4), component.panorama.getPosition().lat().toFixed(4));
  assert.equal(component.lng.toFixed(4), component.panorama.getPosition().lng().toFixed(4));

});

test('lat and lng are updated properly', function ( assert ) {
  let lat = latRandomizer();
  let lng = lngRandomizer();

  let component = this.subject({
    lat: lat,
    lng: lng
  });
  this.render();

  assert.equal(lat.toFixed(4), component.panorama.getPosition().lat().toFixed(4));
  assert.equal(lng.toFixed(4), component.panorama.getPosition().lng().toFixed(4));

  let newLat = latRandomizer();
  let newLng = lngRandomizer();

  component.setProperties({
    lat: newLat,
    lng: newLng
  });

  assert.equal(newLat.toFixed(4), component.panorama.getPosition().lat().toFixed(4));
  assert.equal(newLng.toFixed(4), component.panorama.getPosition().lng().toFixed(4));

});

test('that component is accepting google maps latlng class direct assignment', function(assert) {
  let component = this.subject();
  let lat = latRandomizer();
  let lng = lngRandomizer();
  let position = new google.maps.LatLng(lat, lng);

  component.set('latLng', position);
  this.render();
  assert.equal(position, component.latLng);
  assert.equal(component.latLng.lat(), component.panorama.getPosition().lat());
  assert.equal(component.latLng.lng(), component.panorama.getPosition().lng());
  assert.equal(component.latLng.lat(), component.lat);
  assert.equal(component.latLng.lng(), component.lng);
});

test('that options are assigned properly to the map', function( assert ) {
  let component = this.subject();
  let height = Math.floor(Math.random() * 1000) + "px";
  let width = Math.floor(Math.random() * 1000) + "px";

  component.set('height', height);
  component.set('width', width);
  component.set('lat', latRandomizer());
  component.set('lng', lngRandomizer());
  component.set('pov', {
    heading: Math.floor(Math.random() * 200),
    pitch: Math.floor(Math.random() * 10)
  });
  component.set('zoom', Math.floor(Math.random() * 10));

  component.set('panControl', Boolean(Math.floor(Math.random() * 2)));
  if( component.panControl === true ) {
    component.set('panControlOptions', {
      position:google.maps.ControlPosition.RIGHT_TOP
    });
  }

  component.set('zoomControl', Boolean(Math.floor(Math.random() * 2)));
  if( component.zoomControl === true ) {
    component.set('zoomControlOptions', {
      style: google.maps.ZoomControlStyle.SMALL
    });

  }

  component.set('addressControl', Boolean(Math.floor(Math.random() * 2 )));
  if( component.addressControl === true) {
    component.set('addressControlOptions', {
      position: google.maps.ControlPosition.BOTTOM_CENTER
    });
  }

  component.set('linksControl', Boolean(Math.floor(Math.random() * 2 )));


  $().css({width: width, height: height});
  this.render();

  Ember.run(function() {
    let map = component.panorama;

    //position
    // assert.equal(map.position.H.toFixed(3), component.lat.toFixed(3));
    // assert.equal(map.position.L.toFixed(3), component.lng.toFixed(3));
    assert.equal(component.panorama.getPosition().lat().toFixed(3), component.lat.toFixed(3));
    assert.equal(component.panorama.getPosition().lng().toFixed(3), component.lng.toFixed(3));

    //pov
    assert.equal(map.pov.heading, component.pov.heading);
    assert.equal(map.pov.pitch, component.pov.pitch);

    //zoom
    assert.equal(map.zoom, component.zoom);

    // panControl
    assert.equal(map.panControl, component.panControl);
    assert.equal(map.panControlOptions, component.panControlOptions);

    // zoomControl
    assert.equal(map.zoomControl, component.zoomControl);
    assert.equal(map.zoomControlOptions, component.zoomControlOptions);

    // addressControl
    assert.equal(map.addressControl, component.addressControl);
    assert.equal(map.addressControlOptions, component.addressControlOptions);

    // linksControl
    assert.equal(map.linksControl, component.linksControl);
  });
});


test('can use existing map instance', function(assert) {

  Ember.$('body').append('<div id="map-test-container"></div>');

  let fenway = {lat: 42.345573, lng: -71.098326};
  let map = new google.maps.Map(document.getElementById('map-test-container'), {
    center: fenway,
    zoom: 14
  });

  let component = this.subject({
    map: map
  });

  this.render();

  assert.equal(map.getStreetView(), component.get('panorama'));
  assert.deepEqual(map.getCenter(), component.get('panorama').getPosition());
});
