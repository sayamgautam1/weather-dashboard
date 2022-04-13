let searchInput = document.getElementById("searchlocation");
let searchList = document.getElementById("searchlist");
let currentLocation = document.getElementById("currentlocation");
let currentForecast = document.getElementById("current-forecast");
let currentConditions = document.getElementById("conditions");
let city;
let apiKey = "55dea95f4672af9a4915f9b86aaf1de6"; //get from weather api account
/// event listener to get the city name on enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    city = searchInput.value;
    getData(city);
  }
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
      });
  } catch (error) {
    console.error("error in getting data", error);
  }
}
// display current condtions of the city enetered
function displayCurrentConditions(data) {
  currentLocation.innerText = data.name;
  let listitem1 = document.createElement("li");
  listitem1.appendChild(
    document.createTextNode("Temperature: " + data.main.temp)
  );
  currentConditions.appendChild(listitem1);
  let listitem2 = document.createElement("li");
  listitem2.appendChild(
    document.createTextNode("Humidity: " + data.main.humidity)
  );
  currentConditions.appendChild(listitem2);
  let listitem3 = document.createElement("li");
  listitem3.appendChild(
    document.createTextNode("Windspeed: " + data.wind.speed)
  );
  currentConditions.appendChild(listitem3);
}
/* data needed 
1. coordinates from key cord
2. name from key main
3. weather from key main => temp, wind,humidity 
*/
