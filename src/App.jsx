import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [errorAnimate, seterrorAnimate] = useState(false);

  const apiKey = "881219e19f0cb2e5c87c7f256d444129";

  const handleSearch = async () => {
    if (!city) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === "404") {
        const audio = new Audio("/public/error.mp3"); // 👈 load audio
        audio.play();
        if (navigator.vibrate) {
          navigator.vibrate([300, 100, 300]);
        }
        setWeatherData(null);
        setNotFound(true);
        setAnimate(false);
        seterrorAnimate(false);
        setTimeout(() => seterrorAnimate(true), 10);
      } else {
        setWeatherData(data);
        setNotFound(false);
        setAnimate(false);
        setTimeout(() => setAnimate(true), 50);
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      const audio = new Audio("/public/error.mp3"); // 👈 load audio
      audio.play();
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300]);
      }
      setNotFound(true);
      setAnimate(false);
      seterrorAnimate(false);
      setTimeout(() => seterrorAnimate(true), 10);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getImage = (weather) => {
    switch (weather) {
      case "Clouds":
        return "/cloudy.png";
      case "Clear":
        return "/clear.png";
      case "Snow":
        return "/snow.png";
      case "Rain":
        return "/rain.png";
      case "Mist":
        return "/mist.png";
      case "Haze":
        return "/haze.png";
      default:
        return "";
    }
  };

  return (
    <div className="body">
      <div
        className={`container ${animate ? "fade-in" : ""} ${
          errorAnimate ? "shake" : ""
        }`}
      >
        <div className="search">
          <div className="enter">
            <img id="loc" src="/location.png" alt="loc" />
            <input
              type="text"
              className="input-box"
              placeholder="Enter location"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="button">
            <button className="btn" onClick={handleSearch}>
              <img id="sear" src="/search.png" alt="search" />
            </button>
          </div>
        </div>

        {notFound && (
          <div className="notfound fade-in shake">
            <h2>Sorry, Location not found</h2>
            <img src="/404.png" alt="Not found" />
          </div>
        )}

        {weatherData && (
          <div className="weatherbody fade-in">
            <div className="weather-image">
              <img
                className="weather-img"
                src={getImage(weatherData.weather[0].main)}
                alt="weather"
              />
            </div>
            <div className="tempearture">
              <p className="temp">
                {Math.round(weatherData.main.temp - 273.15)}
              </p>
              <sup>৹</sup>C
            </div>
            <div className="description">
              <p className="des">{weatherData.weather[0].description}</p>
            </div>
            <div className="other">
              <img id="humid" src="/humid.png" alt="Humidity" />
              <div className="humidity">
                <h3>Humidity</h3>
                <p className="humid">{weatherData.main.humidity}%</p>
              </div>
              <img src="/wind.png" id="wind" alt="Wind" />
              <div className="windy">
                <h3>Wind</h3>
                <p className="wind">{weatherData.wind.speed} Km/hr</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
