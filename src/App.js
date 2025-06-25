import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [cuisine, setCuisine] = useState("Indian");
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [recipeDetails, setRecipeDetails] = useState(null);

  const cuisines = [
    "Indian", "Chinese", "Mexican", "Italian", "American",
    "Japanese", "French", "Thai", "Spanish", "Moroccan"
  ];

  const API_KEY = "2a02050ea09b43bbafb1d868cc00ac77";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const query = searchTerm.trim()
          ? `query=${searchTerm}&`
          : "";

        const url = `https://api.spoonacular.com/recipes/complexSearch?${query}cuisine=${cuisine}&number=12&apiKey=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();
        setRecipes(data.results || []);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    fetchRecipes();
  }, [searchTerm, cuisine]);

  const handleCardClick = async (id) => {
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
      );
      const data = await res.json();
      setRecipeDetails(data);
      setSelectedRecipe(id);
    } catch (err) {
      console.error("Error loading recipe details:", err);
    }
  };

  return (
    <div className="App">
      <h1>🍲 Recipe Finder</h1>
      <p>Explore global cuisines — now with real Indian recipes!</p>

      <div className="controls">
        <select value={cuisine} onChange={(e) => {
          setCuisine(e.target.value);
          setSearchTerm("");
        }}>
          {cuisines.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>

        <input
          type="text"
          placeholder="Search recipes..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="gallery">
        {recipes
          .filter((recipe) => {
            const name = recipe.title.toLowerCase();
            const isVeg = name.includes("paneer") || name.includes("dal") || name.includes("veg") || name.includes("chana") || name.includes("tofu");
            return typeFilter === "All"
              ? true
              : typeFilter === "Veg"
              ? isVeg
              : !isVeg;
          })
          .map((recipe) => (
            <div
              key={recipe.id}
              className="card"
              onClick={() => handleCardClick(recipe.id)}
            >
              <img src={recipe.image} alt={recipe.title} />
              <p>{recipe.title}</p>
            </div>
          ))
        }
      </div>

      {selectedRecipe && recipeDetails && (
        <div className="modal" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{recipeDetails.title}</h2>
            <img src={recipeDetails.image} alt={recipeDetails.title} />
            <p dangerouslySetInnerHTML={{ __html: recipeDetails.summary }}></p>

            <h3>📝 Instructions</h3>
            <p>{recipeDetails.instructions || "No instructions available."}</p>

            <h3>🍴 Ingredients</h3>
            <ul>
              {recipeDetails.extendedIngredients?.map((ing) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>

            <button onClick={() => setSelectedRecipe(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
