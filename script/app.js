let searchInput = document.getElementById("searchlocation");
let searchList = document.getElementById("searchlist");
let currentLocation = document.getElementById("currentlocation");
let currentCityName = document.querySelector(".cityname");
let currentWeatherIcon = document.querySelector(".cityWeatherIcon");
let currentCityDate = document.querySelector(".cityCurrentDate");
let currentForecast = document.getElementById("current-forecast");
let currentConditions = document.getElementById("conditions");
let displayForecastSection = document.querySelector(".rside");
let searchBtn = document.getElementById("search-btn");
let city;
let fiveDaysContainer = document.getElementById("fiveday-forecast");
let searchedCity = [];

let todayDate = moment().format("DD/MM/YYYY");
let apiKey = "55dea95f4672af9a4915f9b86aaf1de6"; //get from weather api account
/// event listener to get the city name using form element

function handleFormSubmit(form) {
  const cityname = form.querySelector("#searchlocation").value;
  getData(cityname).then((a) => {
    currentCityName.innerText = a.name;
    getNextFiveDays(a);
    saveCitySearched(a.name);
  });
}
// searchInput.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") {
//     city = searchInput.value.toLowerCase();
//     console.log("hello world");

//     // const newData = getData(city);
//     getData(city).then((a) => {
//       currentCityName.innerText = a.name;
//       getNextFiveDays(a);
//       saveCitySearched(a.name);
//     });
//   }
// });
//event listener to get the city name when clicking the search btn
// searchBtn.addEventListener("click", (e) => {
//   city = searchInput.value.toLowerCase();
//   const newData = () => {
//     getData(city).then((a) => {
//       currentCityName.innerText = a.name;
//       getNextFiveDays(a);
//       saveCitySearched(a.name);
//     });
//   };
//   newData();
// });
// event listener to get data when the btn in the city list is clicked
searchList.addEventListener("click", (e) => {
  city = e.target.innerText.toLowerCase();
  getData(city).then((a) => {
    currentCityName.innerText = a.name;
    getNextFiveDays(a);
  });
});
//get api request of the city name,
function getData(location) {
  const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

  return fetch(requestUrl)
    .then(function (response) {
      if (!response.ok) {
        alert("input error");
        throw response.json();
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      return data;
    });
}
//function display city name
function displayCityName(data) {
  currentCityName.innerText = data.name;
}

// display current condtions of the city enetered
function displayCurrentConditions(data) {
  displayForecastSection.style.display = "block";
  currentConditions.innerText = "";
  // currentCityName.innerText = data.name;
  currentCityDate.innerText = "(" + todayDate + ")";
  // for current weather icon
  currentWeatherIcon.innerText = "";
  let currentWeatherImg = data.current.weather[0].icon;
  let currentWeatherImgSrc = `https://openweathermap.org/img/w/${currentWeatherImg}.png`;
  let currentIcon = document.createElement("img");
  currentIcon.setAttribute("src", currentWeatherImgSrc);
  currentIcon.setAttribute("alt", currentWeatherImg);
  currentIcon.setAttribute("width", "50px");
  currentIcon.setAttribute("height", "50px");
  currentWeatherIcon.append(currentIcon);
  // currentLocation.innerText = data.name + " " + todayDate;
  let listitem1 = document.createElement("li");
  listitem1.appendChild(
    document.createTextNode("Temperature: " + data.current.temp + " °C")
  );
  currentConditions.appendChild(listitem1);
  let listitem2 = document.createElement("li");
  listitem2.appendChild(
    document.createTextNode("Humidity: " + data.current.humidity + " %")
  );
  currentConditions.appendChild(listitem2);
  let listitem3 = document.createElement("li");
  listitem3.appendChild(
    document.createTextNode("Windspeed: " + data.current.wind_speed + " m/s")
  );
  currentConditions.appendChild(listitem3);
}

//local storage to save searched city
function saveCitySearched(cityname) {
  searchList.textContent = "";
  const cityList = JSON.parse(localStorage.getItem("cityname"));
  if (cityList !== null) {
    searchedCity = cityList;
  }

  if (!searchedCity.includes(cityname)) {
    searchedCity.push(cityname);
  }
  searchedCity.forEach((scity) => {
    let cityDisplayed = document.createElement("button");
    cityDisplayed.classList.add("city-list-btn");
    cityDisplayed.appendChild(document.createTextNode(scity));
    let list = document.createElement("li");
    list.innerHTML = `<i class="fa-solid fa-magnifying-glass">`;
    list.appendChild(cityDisplayed);
    searchList.appendChild(list);
  });

  localStorage.setItem("cityname", JSON.stringify(searchedCity));
}
/// display the next 5 days
function getNextFiveDays(data) {
  let longitude = data.coord.lon;
  let lattitude = data.coord.lat;

  const nextFiveDaysUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

  fetch(nextFiveDaysUrl)
    .then(function (futureResponse) {
      if (!futureResponse.ok) {
        throw futureResponse.json();
      }
      return futureResponse.json();
    })
    .then(function (fiveDaysInfo) {
      console.log(fiveDaysInfo);
      displayCurrentConditions(fiveDaysInfo);
      getUvIndex(fiveDaysInfo);
      fiveDaysContainer.innerText = "";

      // create a for loop to display the card 5 times, so the next 5 days
      for (i = 1; i < 6; i++) {
        let selectedCityFuture = {
          date: fiveDaysInfo.daily[i].dt,
          icon: fiveDaysInfo.daily[i].weather[0].icon,
          temperature: fiveDaysInfo.daily[i].temp.day,
          humidity: fiveDaysInfo.daily[i].humidity,
          wind: fiveDaysInfo.daily[i].wind_speed,
        };

        let nextDate = moment
          .unix(selectedCityFuture.date)
          .format("DD/MM/YYYY");
        let iconImageSrc = `https://openweathermap.org/img/w/${selectedCityFuture.icon}.png`;
        let iconImageAlt = `${fiveDaysInfo.daily[i].weather[0].icon}`;

        let eachDayContainer = document.createElement("div");
        eachDayContainer.classList.add("eachdaybox");

        //display date
        let dateDisplayed = document.createElement("h4");
        dateDisplayed.appendChild(document.createTextNode(nextDate));
        eachDayContainer.appendChild(dateDisplayed);

        //display icon
        let iconDisplayed = document.createElement("p");
        let picture = document.createElement("img");
        picture.setAttribute("src", iconImageSrc);
        picture.setAttribute("alt", iconImageAlt);
        picture.setAttribute("width", "50px");
        picture.setAttribute("height", "50px");
        iconDisplayed.appendChild(picture);
        eachDayContainer.appendChild(iconDisplayed);

        //display temperatur
        let tempDisplayed = document.createElement("p");
        tempDisplayed.innerHTML =
          "<h1>Temperature: " +
          selectedCityFuture.temperature +
          "&nbsp;°C</h1>";

        eachDayContainer.appendChild(tempDisplayed);
        //display wind
        let windDisplayed = document.createElement("p");
        windDisplayed.appendChild(
          document.createTextNode("Wind: " + selectedCityFuture.wind + " m/s")
        );
        eachDayContainer.appendChild(windDisplayed);

        //display humidity
        let humidityDisplayed = document.createElement("p");
        humidityDisplayed.appendChild(
          document.createTextNode(
            "Humidity: " + selectedCityFuture.humidity + " %"
          )
        );
        eachDayContainer.appendChild(humidityDisplayed);

        // display all the data in the container
        fiveDaysContainer.appendChild(eachDayContainer);
      }
    });
}

// function to get the uv index of the location
function getUvIndex(uvData) {
  let uvIndex = uvData.current.uvi;
  // console.log(uvIndex);

  let listitem4 = document.createElement("li");
  listitem4.classList.add("uvindex-display");

  let uvDiv = document.createElement("div");
  uvDiv.classList.add("uvDivClass");
  if (uvIndex <= 2) {
    uvDiv.classList.add("green");
  } else if (uvIndex > 2 && uvIndex <= 5) {
    uvDiv.classList.add("yellow");
  } else if (uvIndex > 5 && uvIndex <= 8) {
    uvDiv.classList.add("orange");
  } else {
    uvDiv.classList.add("red");
  }

  uvDiv.appendChild(document.createTextNode(" " + uvIndex));
  listitem4.innerText = "uvIndex : ";
  listitem4.appendChild(uvDiv);

  currentConditions.appendChild(listitem4);
}
// to have previous searched city present
function showSavedCity() {
  let savedCity = JSON.parse(localStorage.getItem("cityname"));
  if (savedCity !== null) {
    savedCity.forEach((scity) => {
      let cityDisplayed = document.createElement("button");
      cityDisplayed.classList.add("city-list-btn");
      cityDisplayed.appendChild(document.createTextNode(scity));
      let list = document.createElement("li");
      list.innerHTML = `<i class="fa-solid fa-magnifying-glass">`;
      list.appendChild(cityDisplayed);
      searchList.appendChild(list);
    });
  }
}
showSavedCity();
/* data needed 
1. coordinates from key cord
2. name from key main
3. weather from key main => temp, wind,humidity 
*/
