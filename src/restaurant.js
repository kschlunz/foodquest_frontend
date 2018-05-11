class Restaurant {
  constructor(place, ) {
    //if it matches the output of the places api, use this constructor
    if (place.formatted_address) {
      this.name = place.name
      this.address = place.formatted_address
      this.hours = place.opening_hours.weekday_text
      this.location = place.geometry.location
      this.want_to_visit = true
      this.have_visited = false
      this.user_id = 1
    } else {
      //if it matches the output
      this.name = place.name
      this.address = place.address
      this.hours = place.hours
      this.location = place.location
      this.user_id = place.user.id
      this.id = place.id
      this.want_to_visit = place.want_to_visit
      this.have_visited = place.have_visited
      if (this.location) {
        //our backend turns the location numbers into strings
        this.location.lat = parseFloat(this.location.lat)
        this.location.lng = parseFloat(this.location.lng)
      }
    }
  }

  dropMarker() {

    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: this.location,
      icon: {
        url: "img/question-balloon.svg",
        scaledSize: new google.maps.Size(54,54)
      }
    });
    if (this.have_visited){
      marker.icon.url = "img/check-pin-balloon-green.svg"
    }
    marker.addListener('click', zoomIn.bind(this));

    function zoomIn() {
      map.zoom = 18
      this.createCardView()
    }

    //store the marker with the class instance
    this.marker = marker


  }

  removeMarker() {
    //first remove the marker from the maps
    //then remove the marker from the class instance
    this.marker.setMap(null)
    this.marker = null
  }


  sendToBackEnd() {
    fetch("http://localhost:3000/api/v1/users/1/restaurants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this)
    }).then(res => res.json()).then((res) => {
      this.id = res.id
    })
  }

  updateStatus(){
    fetch(`http://localhost:3000/api/v1/users/1/restaurants/${this.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        have_visited: this.have_visited,
        want_to_visit: this.want_to_visit
      })
    })
  }



  createSideBarItem() {
    if (!document.getElementById(`${this.name}`)) {
      let li = document.createElement("li")
      li.setAttribute("id", `${this.name}`)
      li.innerHTML = `${this.name}`
      this.have_visited ? document.getElementById('places-been-to').appendChild(li) : document.getElementById('places-want-to-go').appendChild(li)
      li.addEventListener('click', this.createCardView.bind(this))
      let deleteButton = document.createElement("button")
      deleteButton.innerText = "remove"
      deleteButton.setAttribute("id", "remove")
      li.appendChild(deleteButton)
      deleteButton.addEventListener("click", this.deleteRestaurant.bind(this))
    }
  }

  deleteRestaurant(event) {

    //remove the marker from the map
    this.removeMarker()

    fetch(`http:localhost:3000/api/v1/users/${this.user_id}/restaurants/${this.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(() => {
        event.target.parentNode.remove()
      })
      //if the div card is being displayed, remove it
      if (document.getElementById('card')) {
        document.getElementById('card').remove()
      }
  }

  createCardView() {
    map.setCenter(this.location)
    map.zoom = 18
    if (document.getElementById('card')) {
      document.getElementById('card').remove()
    }
    let card = document.createElement("div")
    card.setAttribute("id", "card")
    card.setAttribute("class", "card")
    let nameHeader = document.createElement("p")
    nameHeader.innerHTML = `<center>${this.name}</center><br>`
    let address = document.createElement("p")
    address.innerHTML = `<center>${this.address}</center><br>`
    let hoursList = document.createElement("ul")
    let wantToGoHereButton = document.createElement("button")
    wantToGoHereButton.innerText = "I want to go here"
    wantToGoHereButton.setAttribute("id", "wantToGoHereButton")
    let beenHereButton = document.createElement("button")
    beenHereButton.innerText = "I have been here"
    beenHereButton.setAttribute("id", "beenHereButton")
    for (let day of this.hours) {
      let weekArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      let today = weekArray[new Date().getDay()]
      let dayLi = document.createElement("li")
      dayLi.innerHTML = day
      if (day.includes(today)) {
        dayLi.style.fontWeight = 901
      }
      hoursList.appendChild(dayLi)
    }
    card.appendChild(wantToGoHereButton)
    card.appendChild(beenHereButton)
    card.appendChild(nameHeader)
    card.appendChild(address)
    card.appendChild(hoursList)
    content.appendChild(card)
    //add event listeners
    wantToGoHereButton.addEventListener('click', function(event) {
      if (!document.getElementById(this.name)) {
        this.sendToBackEnd()
        this.dropMarker()
        let li = document.createElement("li")
        li.setAttribute("id", this.name)
        li.innerHTML = `${this.name}`
        document.getElementById('places-want-to-go').appendChild(li)

        let deleteButton = document.createElement("button")
        deleteButton.setAttribute("id", "remove")
        deleteButton.innerText = "remove"
        li.appendChild(deleteButton)
        deleteButton.addEventListener("click", this.deleteRestaurant.bind(this))
        li.addEventListener('click', this.createCardView.bind(this))
      } else {
        let listItem = document.getElementById(this.name)
        listItem.remove()
        let list = document.getElementById('places-want-to-go')
        list.appendChild(listItem)

        this.removeMarker()
        this.want_to_visit = true
        this.have_visited = false
        this.dropMarker()
        this.updateStatus()
      }
    }.bind(this))

    beenHereButton.addEventListener('click', function(event) {
      if (!document.getElementById(`${this.name}`)) {
        this.have_visited = true
        this.sendToBackEnd()
        this.dropMarker()
        let li = document.createElement("li")
        li.setAttribute("id", `${this.name}`)
        li.innerHTML = `${this.name}`
        document.getElementById('places-been-to').appendChild(li)

        let deleteButton = document.createElement("button")
        deleteButton.setAttribute("id", "remove")
        deleteButton.innerText = "remove"
        li.appendChild(deleteButton)
        deleteButton.addEventListener("click", this.deleteRestaurant.bind(this))
        li.addEventListener('click', this.createCardView.bind(this))
      } else {
        let listItem = document.getElementById(this.name)
        listItem.remove()
        let list = document.getElementById('places-been-to')
        list.appendChild(listItem)
        this.removeMarker()
        this.want_to_visit = false
        this.have_visited = true
        this.dropMarker()
        this.updateStatus()
      }
    }.bind(this))

    card.addEventListener('click', (event) => {
      map.setCenter(this.location)
      map.zoom = 18

    })
  }

}
