import { useState } from "react";

export default function FoodPage() {
  const [food, setFood] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [meal, setMeal] = useState(null);

  const handleFoodSearch = async () => {
    if (!food.trim()) {
      setErrorMsg("Please enter a dish name");
      setMeal(null);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setMeal(null);

    try {
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        food
      )}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.meals || data.meals.length === 0) {
        setErrorMsg("No recipe found! Try another dish name.");
        setLoading(false);
        return;
      }

      setMeal(data.meals[0]);
    } catch (err) {
      setErrorMsg("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  const getIngredients = (mealObj) => {
    let list = [];
    for (let i = 1; i <= 20; i++) {
      const ing = mealObj[`strIngredient${i}`];
      const meas = mealObj[`strMeasure${i}`];
      if (ing && ing.trim()) {
        list.push(`${meas ? meas : ""} ${ing}`.trim());
      }
    }
    return list;
  };

  return (
    <div className="bigCard">
      <h2 className="pageTitle">Food Recipe Discovery</h2>

      <div className="searchRow">
        <input
          className="searchInput"
          type="text"
          placeholder='Enter food name (e.g., "Pizza")'
          value={food}
          onChange={(e) => setFood(e.target.value)}
        />

        <button className="searchBtn" onClick={handleFoodSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {errorMsg && <p className="errorText">{errorMsg}</p>}

      {meal && (
        <div className="foodBigCard">
          <div className="foodTop">
            <div className="foodImgWrap">
              <img className="foodImg" src={meal.strMealThumb} alt={meal.strMeal} />
            </div>

            <div className="foodInfo">
              <h1 className="foodTitle">{meal.strMeal}</h1>
              <p className="foodMeta">
                {meal.strCategory} | {meal.strArea}
              </p>

              <h3 className="foodHeading">Ingredients:</h3>

              <div className="foodIngredientsGrid">
                {getIngredients(meal).slice(0, 10).map((item, index) => (
                  <p className="foodIngredient" key={index}>
                    • {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="foodBottom">
            <h3 className="foodHeading">Instructions:</h3>
            <p className="foodInstructions">{meal.strInstructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}
