import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../components/styles.css";

const Temperature = () => {
  const [temp, setTemp] = useState(null);
  const [city, setCity] = useState("");

  const getTempColor = () => {
    if (temp >= 10 && temp <= 20) {
      return "black"; // 10–20
    } else if (temp >= 30) {
      return "red"; // 30–40
    } else {
      return "purple"; // below 30
    }
  };

  const getTemperature = () => {
    if (!city) return;

    axios
      .get("https://geocoding-api.open-meteo.com/v1/search", {
        params: { name: city, count: 1 },
      })
      .then((res) => {
        const { latitude, longitude } = res.data.results[0];

        return axios.get("https://api.open-meteo.com/v1/forecast", {
          params: {
            latitude,
            longitude,
            current_weather: true,
          },
        });
      })
      .then((res) => {
        setTemp(res.data.current_weather.temperature);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div className="head">
        <Link to="/">Main Page</Link>
        <Link to="/temperature">Weather Page</Link>
        <Link to="/population">Population Page</Link>
        <br />
        <h3>Welcome to API access via Axios - Users Page!</h3>
      </div>

      <br />

      {/* City Input */}
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          width: 400,
          height: 50,
          padding: 10,
          color: "blue",
          backgroundColor: "#daeff5ff",
          fontSize: 20,
        }}
      />

      <br />
      <br />

      <button onClick={getTemperature}>Get Temperature</button>

      <br />
      <br />

      {temp !== null && (
        <h1 style={{ color: getTempColor() }}>Temperature is {temp} °C</h1>
      )}
    </div>
  );
};

export default Temperature;
