class Restaurant{
  constructor (place){
    this.name = place.name
    this.address = place.formatted_address
    this.hours = place.opening_hours.weekday_text
    this.location = place.geometry.location
  }

  createCardView(){
    if (document.getElementById('card')){
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
    for (let day of this.hours){
      let weekArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      let today = weekArray[new Date().getDay()]
      let dayLi = document.createElement("li")
      dayLi.innerHTML = day
      if (day.includes(today)){
        dayLi.style.fontWeight = 901
      }
      hoursList.appendChild(dayLi)
    }
    card.appendChild(nameHeader)
    card.appendChild(address)
    card.appendChild(hoursList)


    card.addEventListener('click', (event) => {
      map.setCenter(this.location)
      map.zoom = 18


      // if (!document.getElementById(`${this.name}`)) {
      //   let li = document.createElement("li")
      //   li.setAttribute("id", `${this.name}`)
      //   li.innerHTML = `${this.name}`
      //   ul.appendChild(li)
      //   li.addEventListener('click', (event) => {
      //     card.innerHTML = `<h2><center>${place.name}</center></h2><br></br><center> ${place.formatted_address}</center> <br></br><ul> hours: ${place.opening_hours.weekday_text}<ul/>`
      //     map.setCenter(place.geometry.location)
      //     map.zoom = 18
      //   })
      // }
    })
    content.appendChild(card)
  }


}
