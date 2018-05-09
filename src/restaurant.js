class Restaurant {
  constructor(place) {
    if (place.formatted_address) {
      this.name = place.name
      this.address = place.formatted_address
      this.hours = place.opening_hours.weekday_text
      this.location = place.geometry.location
      this.user_id = 1
    } else {
      this.name = place.name
      this.address = place.address
      this.hours = place.hours
      this.location = place.location
      this.user_id = place.user.id
      this.id = place.id
      if (this.location) {
        this.location.lat = parseFloat(this.location.lat)
        this.location.lng = parseFloat(this.location.lng)
      }
    }
  }

  dropMarker() {
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: this.location
    });
    marker.addListener('click', zoomIn.bind(this));

    function zoomIn() {
      console.log(this)
      map.zoom = 18
      this.createCardView()
    }


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


  createSideBarItem() {
    if (!document.getElementById(`${this.name}`)) {
      let li = document.createElement("li")
      li.setAttribute("id", `${this.name}`)
      li.innerHTML = `${this.name}`
      ul.appendChild(li)
      li.addEventListener('click', this.createCardView.bind(this))
      let deleteButton = document.createElement("button")
      deleteButton.innerText = "delete"
      li.appendChild(deleteButton)
      deleteButton.addEventListener("click", this.deleteRestaurant.bind(this))
    }
  }

  deleteRestaurant(event) {
    if (card) {
      card.remove()
    }
    console.log(this)
    console.log(`http:localhost:3000/api/v1/users/${this.user_id}/restaurants/${this.id}`)
    fetch(`http:localhost:3000/api/v1/users/${this.user_id}/restaurants/${this.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(() => {
        event.target.parentNode.remove()
      })
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
    let nameHeader = document.createElement("h2")
    nameHeader.innerHTML = `<center>${this.name}</center><br>`
    let address = document.createElement("p")
    address.innerHTML = `<center>${this.address}</center><br>`
    let hoursList = document.createElement("ul")
    let saveButton = document.createElement("button")
    saveButton.innerText = "save"
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
    card.appendChild(saveButton)
    card.appendChild(nameHeader)
    card.appendChild(address)
    card.appendChild(hoursList)

    //add event listeners
    saveButton.addEventListener('click', function(event) {
      if (!document.getElementById(`${this.name}`)) {
        this.sendToBackEnd()
        let li = document.createElement("li")
        li.setAttribute("id", `${this.name}`)
        li.innerHTML = `${this.name}`
        ul.appendChild(li)

        let deleteButton = document.createElement("button")
        deleteButton.innerText = "delete"
        li.appendChild(deleteButton)
        deleteButton.addEventListener("click", this.deleteRestaurant.bind(this))
        li.addEventListener('click', this.createCardView.bind(this))
      }
    }.bind(this))

    card.addEventListener('click', (event) => {
      map.setCenter(this.location)
      map.zoom = 18

    })
    content.appendChild(card)
  }

}








//
// marker = new google.maps.Marker({
//   map: map,
//   animation: google.maps.Animation.DROP,
//   position: this.location
// });
// marker.addListener('click', toggleBounce);
//
// function toggleBounce() {
//   if (marker.getAnimation() !== null) {
//     marker.setAnimation(null);
//   } else {
//     marker.setAnimation(google.maps.Animation.BOUNCE);
//   }
// }
