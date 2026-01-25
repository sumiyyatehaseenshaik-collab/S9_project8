import { useState } from "react";

export default function PopulationPage() {
  const [place, setPlace] = useState("India");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const handlePopulationSearch = async () => {
    if (!place.trim()) {
      setErrorMsg("Please enter a country name");
      setResult(null);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(
        place
      )}?fullText=true`;

      const res = await fetch(url);

      if (!res.ok) {
        setErrorMsg("Country not found! Try: India, USA, Japan");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const country = data[0];

      setResult({
        name: country.name.common,
        region: country.region,
        population: country.population,
      });
    } catch (err) {
      setErrorMsg("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bigCard">
      <h2 className="pageTitle">Population Finder</h2>

      <div className="searchRow">
        <input
          className="searchInput"
          type="text"
          placeholder="Enter country name"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />

        <button className="searchBtn" onClick={handlePopulationSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {errorMsg && <p className="errorText">{errorMsg}</p>}

      {result && (
        <div className="weatherResultCard">
          <p className="placeText">
            {result.name} ({result.region})
          </p>

          <h1 className="tempText">
            Population: {result.population.toLocaleString("en-IN")}
          </h1>
        </div>
      )}
    </div>
  );
}
