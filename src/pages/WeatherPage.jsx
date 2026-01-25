import { useState } from "react";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if (!city.trim()) {
      setErrorMsg("Please enter a city name");
      setResult(null);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`;

      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setErrorMsg("City not found! Please try a correct city name.");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      setResult({
        name,
        country,
        temperature: weatherData?.current_weather?.temperature,
      });
    } catch (err) {
      setErrorMsg("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bigCard">
      <h2 className="pageTitle">Weather Page</h2>

      <div className="searchRow">
        <input
          className="searchInput"
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button className="searchBtn" onClick={handleSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {errorMsg && <p className="errorText">{errorMsg}</p>}

      {result && (
        <div className="weatherResultCard">
          <p className="placeText">
            {result.name}, {result.country}
          </p>

          <h1 className="tempText">
            Current Temperature: {result.temperature}°C <span className="icon">❄️</span>
          </h1>
        </div>
      )}
    </div>
  );
}
