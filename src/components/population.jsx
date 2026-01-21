import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../components/styles.css";

const Population = () => {
  const [city, setCity] = useState("");
  const [population, setPopulation] = useState(null);
  const [error, setError] = useState("");

  const getPopulation = async () => {
    if (!city) return;

    try {
      setError("");
      setPopulation(null);

      const res = await axios.get(
        "https://geocoding-api.open-meteo.com/v1/search",
        { params: { name: city, count: 1 } }
      );

      if (!res.data.results || res.data.results.length === 0) {
        setError("City not found!");
        return;
      }

      const data = res.data.results[0];

      if (!data.population) {
        setError("Population data not available for this city 😕");
        return;
      }

      setPopulation(data.population);
    } catch (err) {
      console.log(err);
      setError("Something went wrong!");
    }
  };

  return (
    <div>
      <div className="head">
        <Link to="/">Main Page</Link>
        <Link to="/population">Population Page</Link>
        <br />
        <h3>Welcome to API access via Axios - Population Page!</h3>
      </div>

      <br />

      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          width: 400,
          height: 50,
          padding: 10,
          color: "white",
          backgroundColor: "rgb(171, 118, 196)",
          fontSize: 20,
        }}
      />

      <br />
      <br />

      <button onClick={getPopulation}>Get Population</button>

      <br />
      <br />

      {population !== null && <h1>Population is {population}</h1>}
      {error && <h2 style={{ color: "red" }}>{error}</h2>}
    </div>
  );
};

export default Population;
