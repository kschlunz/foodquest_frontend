class Restaurant {
  constructor(place) {
    this.name = place.name
    this.address = place.formatted_address
    this.hours = place.opening_hours.weekday_text
    this.location = place.geometry.location
  }


  saveButtonClicked() {
    let li = document.createElement("li")
    li.setAttribute("id", `${this.name}`)
    li.innerHTML = `${this.name}`
    ul.appendChild(li)
    li.addEventListener('click', createCardView)
  }

  createCardView() {
    console.log(this)
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
        let li = document.createElement("li")
        li.setAttribute("id", `${this.name}`)
        li.innerHTML = `${this.name}`
        ul.appendChild(li)
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
