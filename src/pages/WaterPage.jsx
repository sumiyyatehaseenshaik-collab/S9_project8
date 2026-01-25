import { useState } from "react";

export default function WaterPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resources, setResources] = useState([]);

  const handleWaterSearch = async () => {
    if (!city.trim()) {
      setErrorMsg("Please enter a city name");
      setResources([]);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResources([]);

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`;

      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setErrorMsg("City not found! Try another city name.");
        setLoading(false);
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      const overpassQuery = `
        [out:json];
        (
          node["waterway"="river"](around:12000,${latitude},${longitude});
          node["waterway"="stream"](around:12000,${latitude},${longitude});
          node["waterway"="canal"](around:12000,${latitude},${longitude});
          node["waterway"="drain"](around:12000,${latitude},${longitude});
          node["natural"="water"](around:12000,${latitude},${longitude});
          node["water"="lake"](around:12000,${latitude},${longitude});

          way["waterway"="river"](around:12000,${latitude},${longitude});
          way["waterway"="stream"](around:12000,${latitude},${longitude});
          way["waterway"="canal"](around:12000,${latitude},${longitude});
          way["waterway"="drain"](around:12000,${latitude},${longitude});
          way["natural"="water"](around:12000,${latitude},${longitude});
          way["water"="lake"](around:12000,${latitude},${longitude});
        );
        out center 60;
      `;

      const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: overpassQuery,
      });

      const overpassData = await overpassRes.json();

      const formatted = overpassData.elements.map((item) => {
        const tags = item.tags || {};
        return {
          resourceName: tags.name || "Unnamed Resource",
          category: tags.waterway || tags.natural || tags.water || "water resource",
        };
      });

      const unique = [];
      const seen = new Set();

      for (let item of formatted) {
        const key = item.resourceName + "-" + item.category;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(item);
        }
      }

      setResources(unique.slice(0, 18));
    } catch (err) {
      setErrorMsg("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bigCard">
      <h2 className="pageTitle">Water Resources</h2>

      <div className="searchRow">
        <input
          className="searchInput"
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button className="searchBtn" onClick={handleWaterSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {errorMsg && <p className="errorText">{errorMsg}</p>}

      {resources.length > 0 && (
        <div className="eduGrid">
          {resources.map((r, index) => (
            <div className="eduCard" key={index}>
              <h3 className="eduTitle">{r.resourceName}</h3>
              <p className="eduType">Category: {r.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
