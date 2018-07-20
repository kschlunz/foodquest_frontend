//global variables for ease of use
//may move these inside classes
let map
let markers
let bounds
let autocomplete

document.addEventListener("DOMContentLoaded", function(e) {
  let jsFile = document.createElement("script")
  jsFile.type = "text/javascript"
  jsFile.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4WyhZwCUxnclM61INQrbBQt4MH2qFm0E&libraries=places&callback=initMap"
  document.getElementsByTagName('head')[0].appendChild(jsFile)
})

function initMap() {
  let pos

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      //the browser supports geolocation and permission was given
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      makeMap(pos)
    }, function() {
      //the browser supports geolocation but they denied permission
      makeMap(pos)
    })
  } else {
    //the browser doesnt support geolocation
    makeMap(pos)
  }
}

function makeMap(pos) {
  //style the map
  let styledMapType = new google.maps.StyledMapType(
    [{
        "elementType": "geometry",
        "stylers": [{
          "color": "#ebe3cd"
        }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#523735"
        }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#f5f1e6"
        }]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#c9b2a6"
        }]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#dcd2be"
        }]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#ae9e90"
        }]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [{
          "color": "#dfd2ae"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
          "color": "#dfd2ae"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#93817c"
        }]
      },
      {
        "featureType": "poi.attraction",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.government",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.medical",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.park",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#a5b076"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#447530"
        }]
      },
      {
        "featureType": "poi.place_of_worship",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.school",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "poi.sports_complex",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "color": "#f5f1e6"
        }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
          "color": "#fdfcf8"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
          "color": "#f8c967"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#e9bc62"
        }]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{
          "color": "#e98d58"
        }]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#db8555"
        }]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#806b63"
        }]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
          "color": "#dfd2ae"
        }]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#8f7d77"
        }]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#ebe3cd"
        }]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [{
          "color": "#dfd2ae"
        }]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#b9d3c2"
        }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#92998d"
        }]
      }
    ], {
      name: 'Styled Map'
    }
  )
  
  if (pos.lat) {
    //nothing
  } else {
    //if no pos, default to flatiron school
    pos = {
      lat: 40.7051928,
      lng: -74.0138964
    }
  }
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: pos,
  })
  map.mapTypes.set('styled_map', styledMapType)
  map.setMapTypeId('styled_map')


  autocomplete = new google.maps.places.Autocomplete(document.getElementById('search-box'));

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);
  //things here get called after the map gets loaded
  makeListeners()
  makeSidebar()
}

function makeSidebar() {
  fetch("http://localhost:3000/api/v1/users/1/restaurants")
    .then(res => res.json())
    .then((res) => {
      for (let result of res) {
        restaurant = new Restaurant(result)
        restaurant.createSideBarItem()
        setTimeout(restaurant.dropMarker.bind(restaurant), 1000)
      }
    })
}

function makeListeners() {
  placesService = new google.maps.places.PlacesService(map);
  console.log(map)
  map.addListener("click", function(event) {
    //when clicking on a place
    if (event.placeId) {
      event.stop()
      placesService.getDetails({
        placeId: event.placeId
      }, function(place, status) {
        if (status === 'OK') {
          let restaurant = new Restaurant(place)
          restaurant.createCardView()
        }
      })
    }
  })
  //autocomplete event listener
  autocomplete.addListener('place_changed', function(event) {
    let place = autocomplete.getPlace()
    console.log(place)
    console.log(this)
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    } else {
      let restaurant = new Restaurant(place)
      restaurant.createCardView()
    }
  })
  //random button listeners
  let randomBeenTo = document.getElementById('random-been-to')
  randomBeenTo.addEventListener("click", function(event) {
    let list = document.getElementById("places-been-to")
    let randomLi = list.children[Math.floor(Math.random() * list.children.length)]
    randomLi.click()
  })
  let randomWantToGo = document.getElementById('random-want-to-go')
  randomWantToGo.addEventListener("click", function(event) {
    let list = document.getElementById("places-want-to-go")
    let randomLi = list.children[Math.floor(Math.random() * list.children.length)]
    randomLi.click()
  })
}
