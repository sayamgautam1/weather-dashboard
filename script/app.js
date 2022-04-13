let searchInput = document.getElementById("searchlocation");
let searchList = document.getElementById("searchlist");
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
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(requestUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
  } catch (error) {
    console.error("erroe in getting data", error);
  }
}
