function initMap() {
  var myLatLng = {
    lat: 40.7051928,
    lng: -74.0138964
  };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: myLatLng
  });

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  var clickHandler = new ClickEventHandler(map, origin);
}

let ClickEventHandler = function(map, origin) {
  this.origin = origin;
  this.map = map;
  this.placesService = new google.maps.places.PlacesService(map);
  console.log(this)
  // // Listen for clicks on the map.
  this.map.addListener('click', this.handleClick.bind(this));
};

ClickEventHandler.prototype.handleClick = function(event) {
  console.log(event)
  console.log('You clicked on: ' + event.latLng);
  // If the event has a placeId, use it.
  if (event.placeId) {
    console.log('You clicked on place:' + event.placeId);

    // Calling e.stop() on the event prevents the default info window from
    // showing.
    // If you call stop here when there is no placeId you will prevent some
    // other map click event handlers from receiving the event.
    event.stop();
    this.getPlaceInformation(event.placeId);
  }
};

ClickEventHandler.prototype.getPlaceInformation = function(placeId) {
  var me = this;
  console.log(me, "is me"
  )
  this.placesService.getDetails({placeId: placeId}, function(place, status) {
    if (status === 'OK') {
      console.log("im inside")
      header = document.createElement("h1")
      header.innerText = `name: ${place.name}, address: ${place.formatted_address} hours: ${place.opening_hours.weekday_text} latlong: ${place.geometry.location}`
      header.addEventListener('click', (event)=> {
        console.log(map)
        console.log(map.setCenter)
      })
      document.body.append(header)
    }
  });
}

google.maps.event.addDomListener(window, 'load', initMap);
