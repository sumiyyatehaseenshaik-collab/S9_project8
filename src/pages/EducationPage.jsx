import { useState } from "react";

export default function EducationPage() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [places, setPlaces] = useState([]);

  const handleEducationSearch = async () => {
    if (!city.trim()) {
      setErrorMsg("Please enter a city name");
      setPlaces([]);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setPlaces([]);

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
          node["amenity"="school"](around:12000,${latitude},${longitude});
          node["amenity"="college"](around:12000,${latitude},${longitude});
          node["amenity"="university"](around:12000,${latitude},${longitude});
          way["amenity"="school"](around:12000,${latitude},${longitude});
          way["amenity"="college"](around:12000,${latitude},${longitude});
          way["amenity"="university"](around:12000,${latitude},${longitude});
        );
        out center 60;
      `;

      const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: overpassQuery,
      });

      const overpassData = await overpassRes.json();

      const formatted = overpassData.elements
        .map((item) => {
          const tags = item.tags || {};
          return {
            instName: tags.name || "Unnamed Institution",
            type: tags.amenity || "school",
          };
        })
        .filter((x) => x.instName !== "Unnamed Institution");

      const unique = [];
      const seen = new Set();

      for (let item of formatted) {
        if (!seen.has(item.instName)) {
          seen.add(item.instName);
          unique.push(item);
        }
      }

      setPlaces(unique.slice(0, 18));
    } catch (err) {
      setErrorMsg("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bigCard">
      <h2 className="pageTitle">Educational Institutions</h2>

      <div className="searchRow">
        <input
          className="searchInput"
          type="text"
          placeholder="Enter city name (exactly)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button className="searchBtn" onClick={handleEducationSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {errorMsg && <p className="errorText">{errorMsg}</p>}

      {places.length > 0 && (
        <div className="eduGrid">
          {places.map((p, index) => (
            <div className="eduCard" key={index}>
              <h3 className="eduTitle">{p.instName}</h3>
              <p className="eduType">Type: {p.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
