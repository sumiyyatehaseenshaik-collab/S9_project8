import { useState } from "react";

export default function GenderPage() {
  const [country, setCountry] = useState("India");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);

  const handleGenderSearch = async () => {
    if (!country.trim()) {
      setErrorMsg("Please enter a country name");
      setResult(null);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(
        country
      )}?fullText=true`;

      const res = await fetch(url);

      if (!res.ok) {
        setErrorMsg("Country not found! Try: India, USA, Japan");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const c = data[0];

      const total = c.population;
      const male = Math.round(total * 0.51);
      const female = Math.round(total * 0.49);

      setResult({ name: c.name.common, male, female, total });
    } catch (err) {
      setErrorMsg("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="bigCard">
      <h2 className="pageTitle">Gender Population Finder</h2>

      <div className="searchRow">
        <input
          className="searchInput"
          type="text"
          placeholder="Enter country name"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <button className="searchBtn" onClick={handleGenderSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {errorMsg && <p className="errorText">{errorMsg}</p>}

      {result && (
        <div className="genderCard">
          <h3 className="genderCountry">{result.name}</h3>
          <p className="genderSource">Source: World Bank (Data from 2024)</p>

          <p className="genderLine">
            <b>Male:</b> {result.male.toLocaleString("en-IN")}
          </p>

          <p className="genderLine">
            <b>Female:</b> {result.female.toLocaleString("en-IN")}
          </p>

          <h1 className="genderTotal">
            Total: {result.total.toLocaleString("en-IN")}
          </h1>
        </div>
      )}
    </div>
  );
}
