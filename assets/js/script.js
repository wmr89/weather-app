let apiKey = "c2d5188c2548f1b6f95103ec1538c8cc";
let citySearch = document.getElementById("cityInput");
let searchButton = document.getElementById("searchButton");
let searchHistory = document.getElementById("searchHistory");
let viewHistory = document.getElementById("viewHistory");
let cityHistory = JSON.parse(localStorage.getItem("cityHistory"))

let searchCity = function (event) {
    event.preventDefault();
    let geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + citySearch.value + "&limit=1&appid=" + apiKey;
    fetch(geocodeURL)
        .then(response => response.json())
        .then(result => {
            let lat = result[0].lat;
            let lon = result[0].lon;
            let weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

            fetch(weatherURL)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    displayCard(result);
                })
        })
    saveHistory()
    citySearch.value = '';
}

let displayCard = function (result) {
    for (let i = 0; i < 5; i++) {
        let cardId = "day" + i;
        let x = i * 8;
        let card = document.getElementById(cardId);
        let dateLi = document.createElement("li")
        let iconLi = document.createElement("li");
        let iconImg = document.createElement("img");
        let imgSource = "https://openweathermap.org/img/wn/" + result.list[x].weather[0].icon + "@2x.png";
        iconImg.setAttribute("src", imgSource);
        iconLi.append(iconImg);
        let tempLi = document.createElement("li");
        let windLi = document.createElement("li");
        let humidityLi = document.createElement("li");

        dateLi.textContent = dayjs.unix(result.list[x].dt).format('MMM D, YYYY, hh:mm:ss a');
        tempLi.textContent = "Temperature: " + result.list[x].main.temp + " °F";
        windLi.textContent = "Wind Speed: " + result.list[x].wind.speed + " mph";
        humidityLi.textContent = "Humidity: " + result.list[x].main.humidity + " %";

        card.innerHTML = ""
        card.appendChild(dateLi);
        card.appendChild(iconLi)
        card.appendChild(tempLi);
        card.appendChild(windLi);
        card.appendChild(humidityLi);
    }
}

let saveHistory = function () {
    let cityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    if (cityHistory == null) {
        let cityHistory = [];
        cityHistory.push(citySearch.value);
        localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    } else {
        if (!cityHistory.includes(citySearch.value)) {
            cityHistory.push(citySearch.value);
            localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
        }
    }
}

let displayHistory = function () {
    searchHistory.innerHTML ="";
    if (!cityHistory || !cityHistory[0]) {
        searchHistory.innerHTML ="";
        let noResultItem = document.createElement("li");
        //noResultItem.setAttribute("class", "list-item tile is-child box")
        noResultItem.textContent = "Sorry, No Favorites Found";
        searchHistory.appendChild(noResultItem);
    } else {
        for (let i = 0; i < cityHistory.length; i++) {
            displayCity = cityHistory[i];
            let historyLi = document.createElement("li");
            historyLi.setAttribute("class", "history-item")
            //create text for li
            historyLi.textContent = displayCity;
            searchHistory.appendChild(historyLi);
            historyLi.addEventListener("click", searchHistoryItem)
        }
    }
}

let clickHistory = function(){
const historyContainer = document.getElementById("history-container");

historyContainer.classList.toggle('hide');
displayHistory()
}

let searchHistoryItem = function(event) {
    let city = event.target.textContent
    console.log(city)
     let geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
     fetch(geocodeURL)
         .then(response => response.json())
         .then(result => {
             let lat = result[0].lat;
             let lon = result[0].lon;
             let weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;

             fetch(weatherURL)
                .then(response => response.json())
                 .then(result => {
                     console.log(result);
                     displayCard(result);
                 })
         })
 }







viewHistory.addEventListener("click", clickHistory)
searchButton.addEventListener("click", searchCity);
