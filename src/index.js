//global variables for ease of use
//may move these inside classes
let map
let markers
let bounds

document.addEventListener("DOMContentLoaded", function(e) {
  let jsFile = document.createElement("script")
  jsFile.type = "text/javascript"
  jsFile.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4WyhZwCUxnclM61INQrbBQt4MH2qFm0E&libraries=places&callback=initMap"
  document.getElementsByTagName('head')[0].appendChild(jsFile)
})

function initMap() {
  let pos
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
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

function makeMap(pos){
  if (pos.lat){
    //nothing
  } else{
    //if no pos, default to flatiron school
    pos = {
      lat: 40.7051928,
      lng: -74.0138964
    }
  }
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: pos
  })
  //things here get called after the map gets loaded
  makeListeners()
  makeSidebar()
}
function makeSidebar(){
  fetch("http://localhost:3000/api/v1/users/1/restaurants")
  .then(res=>res.json())
  .then((res)=>{
    for (let result of res){
      restaurant = new Restaurant(result)
      restaurant.createSideBarItem()
    }
  })
}

function makeListeners(){
  placesService = new google.maps.places.PlacesService(map);
  console.log(map)
  map.addListener("click", function(event){
    //when clicking on a place
    if (event.placeId){
      event.stop()
      placesService.getDetails({placeId: event.placeId}, function(place, status){
        if (status === 'OK'){
          let restaurant = new Restaurant(place)
          restaurant.createCardView()
        }
      })
    }
  })
}
