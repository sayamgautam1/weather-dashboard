let searchInput = document.getElementById("searchlocation");
let searchList = document.getElementById("searchlist");
let currentLocation = document.getElementById("currentlocation");
let currentForecast = document.getElementById("current-forecast");
let currentConditions = document.getElementById("conditions");
let displayForecastSection = document.querySelector(".rside");
let city;
let fiveDaysContainer = document.getElementById("fiveday-forecast");
let searchedCity = [];
let todayDate = moment().format("L");
let apiKey = "55dea95f4672af9a4915f9b86aaf1de6"; //get from weather api account
/// event listener to get the city name on enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    city = searchInput.value.toLowerCase();
    getData(city);
    saveCitySearched(city);
  }
});
// event listener to get data when the btn in the city list is clicked
searchList.addEventListener("click", (e) => {
  city = e.target.innerText.toLowerCase();
  getData(city);
});
//get api request of the city name,
function getData(location) {
  try {
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;

    fetch(requestUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(function (data) {
        displayCurrentConditions(data);
        getNextFiveDays(data);
      });
  } catch (error) {
    console.error("error in getting data", error);
  }
}
// display current condtions of the city enetered
function displayCurrentConditions(data) {
  displayForecastSection.style.display = "block";
  currentConditions.innerText = "";
  currentLocation.innerText = data.name + " " + todayDate;
  let listitem1 = document.createElement("li");
  listitem1.appendChild(
    document.createTextNode("Temperature: " + data.main.temp + "°F")
  );
  currentConditions.appendChild(listitem1);
  let listitem2 = document.createElement("li");
  listitem2.appendChild(
    document.createTextNode("Humidity: " + data.main.humidity + "%")
  );
  currentConditions.appendChild(listitem2);
  let listitem3 = document.createElement("li");
  listitem3.appendChild(
    document.createTextNode("Windspeed: " + data.wind.speed + "MPH")
  );
  currentConditions.appendChild(listitem3);
}

//local storage to save searched city
function saveCitySearched(cityname) {
  searchList.textContent = "";
  if (!searchedCity.includes(cityname)) {
    searchedCity.push(cityname);
  }
  searchedCity.forEach((scity) => {
    let cityDisplayed = document.createElement("button");
    cityDisplayed.classList.add("city-list-btn");
    cityDisplayed.appendChild(document.createTextNode(scity));
    let list = document.createElement("li");
    list.appendChild(cityDisplayed);
    searchList.appendChild(list);
  });

  localStorage.setItem("cityname", JSON.stringify(searchedCity));
}
/// display the next 5 days
function getNextFiveDays(data) {
  let longitude = data.coord.lon;
  let lattitude = data.coord.lat;

  try {
    const nextFiveDaysUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;

    fetch(nextFiveDaysUrl)
      .then(function (futureResponse) {
        if (!futureResponse.ok) {
          throw futureResponse.json();
        }
        return futureResponse.json();
      })
      .then(function (fiveDaysInfo) {
        // create a for loop to display the card 5 times, so the next 5 days
        for (i = 0; i < 5; i++) {
          let selectedCityFuture = {
            date: fiveDaysInfo.daily[i].dt,
            icon: fiveDaysInfo.daily[i].weather[0].icon,
            temperature: fiveDaysInfo.daily[i].temp.day,
            humidity: fiveDaysInfo.daily[i].humidity,
          };

          let nextDate = moment
            .unix(selectedCityFuture.date)
            .format("MM/DD/YYYY");
          let iconImageSrc = `https://openweathermap.org/img/w/${selectedCityFuture.icon}.png`;
          let iconImageAlt = `${fiveDaysInfo.daily[i].weather[0].icon}`;

          let eachDayContainer = document.createElement("div");
          eachDayContainer.classList.add("eachDayBox");

          //display date
          let dateDisplayed = document.createElement("h4");
          dateDisplayed.appendChild(document.createTextNode(nextDate));
          eachDayContainer.appendChild(dateDisplayed);

          //display icon
          let iconDisplayed = document.createElement("p");
          let picture = document.createElement("img");
          picture.setAttribute("src", iconImageSrc);
          picture.setAttribute("alt", iconImageAlt);
          iconDisplayed.appendChild(picture);
          eachDayContainer.appendChild(iconDisplayed);

          //display temperatur
          let tempDisplayed = document.createElement("p");
          tempDisplayed.appendChild(
            document.createTextNode(selectedCityFuture.temperature + "F")
          );
          eachDayContainer.appendChild(tempDisplayed);

          //display humidity
          let humidityDisplayed = document.createElement("p");
          humidityDisplayed.appendChild(
            document.createTextNode(selectedCityFuture.humidity)
          );
          eachDayContainer.appendChild(humidityDisplayed);

          // display all the data in the container
          fiveDaysContainer.appendChild(eachDayContainer);
        }
      });
  } catch (error) {
    console.error("error in getting data", error);
  }
}
/* data needed 
1. coordinates from key cord
2. name from key main
3. weather from key main => temp, wind,humidity 
*/
