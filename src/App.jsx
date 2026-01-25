import { useState } from "react";
import "./App.css";

// Pages
import MainPage from "./pages/MainPage";
import WeatherPage from "./pages/WeatherPage";
import PopulationPage from "./pages/PopulationPage";
import GenderPage from "./pages/GenderPage";
import EducationPage from "./pages/EducationPage";
import WaterPage from "./pages/WaterPage";
import FoodPage from "./pages/FoodPage";

export default function App() {
  const tabs = ["Main", "Weather", "Population", "Gender", "Education", "Water", "Food"];
  const [activeTab, setActiveTab] = useState("Main");

  return (
    <div className="page">
      {/* Navbar */}
      <div className="navWrap">
        <div className="navBar">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`navBtn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Pages */}
      {activeTab === "Main" && <MainPage />}
      {activeTab === "Weather" && <WeatherPage />}
      {activeTab === "Population" && <PopulationPage />}
      {activeTab === "Gender" && <GenderPage />}
      {activeTab === "Education" && <EducationPage />}
      {activeTab === "Water" && <WaterPage />}
      {activeTab === "Food" && <FoodPage />}
    </div>
  );
}
