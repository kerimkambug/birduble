import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/addcocktail.css";

function AddCocktail() {
    const [cocktailName, setCocktailName] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState({ name: "", category: "" });
    const [recipe, setRecipe] = useState("");
    const [allIngredients, setAllIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedIngredient, setSelectedIngredient] = useState(null);

    const ingredientCategories = [
        "alkol", "sebze", "soft", "baharat", "meyve", "şurup", "sos", "diğer"
    ];

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const API_URL = process.env.REACT_APP_API_URL || "https://mighty-island-53325-296dd28c851f.herokuapp.com";
                const response = await axios.get(`${API_URL}/api/ingredient/getallingredients`);
                setAllIngredients(response.data.data);
            } catch (error) {
                console.error("Error fetching ingredients:", error);
                setError("Failed to fetch ingredients.");
            }
        };
        fetchIngredients();
    }, []);

    const handleIngredientAmountChange = (ingredientName, enteredAmount) => {
        setAmount(enteredAmount);
        setSelectedIngredient(ingredientName);
    };

    const addIngredientToList = () => {
        if (selectedIngredient && amount) {
            setIngredients((prev) => [
                ...prev,
                { ingredient: selectedIngredient, amount },
            ]);
            setAmount("");
            setSelectedIngredient(null);
        } else {
            setError("Please select an ingredient and enter an amount.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cocktailName || ingredients.length === 0 || !recipe) {
            setError("Please fill out all fields.");
            return;
        }

        try {
            const cocktailData = {
                name: cocktailName,
                ingredients: ingredients,
                recipe: recipe,
            };

            const API_URL = process.env.REACT_APP_API_URL || "https://mighty-island-53325-296dd28c851f.herokuapp.com";
            const response = await axios.post(`${API_URL}/api/cocktail/addcocktail`, cocktailData);
            console.log("Cocktail added:", response.data);
            setCocktailName("");
            setIngredients([]);
            setRecipe("");
            setSearchTerm("");
            setAmount("");
        } catch (error) {
            console.error("Error adding cocktail:", error);
            setError("Failed to add cocktail.");
        }
    };

    const filteredIngredients = allIngredients.filter((ingredient) =>
        ingredient.name && ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="add-cocktail">
            <h2>Add a New Cocktail</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Cocktail Name:</label>
                    <input
                        type="text"
                        value={cocktailName}
                        onChange={(e) => setCocktailName(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Search Ingredients:</label>
                    <input
                        type="text"
                        placeholder="Search Ingredients"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="ingredients-list">
                        {filteredIngredients.map((ingredient) => (
                            <div
                                key={ingredient._id}
                                className={`ingredient-item ${selectedIngredient === ingredient.name ? "selected" : ""}`}
                                onClick={() => setSelectedIngredient(ingredient.name)}
                            >
                                {ingredient.name}
                            </div>
                        ))}
                    </div>

                    {selectedIngredient && (
                        <div className="amount-input">
                            <label>Amount:</label>
                            <input
                                type="text"
                                placeholder="Enter amount (e.g., 40 ml)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={addIngredientToList}
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>

                <div className="added-ingredients">
                    <h3>Added Ingredients:</h3>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.ingredient} - {ingredient.amount}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="new-ingredient">
                    <h3>Or Add New Ingredient</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Ingredient Name"
                        value={newIngredient.name}
                        onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    />
                    <select
                        name="category"
                        value={newIngredient.category}
                        onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        {ingredientCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                const API_URL = process.env.REACT_APP_API_URL || "https://mighty-island-53325-296dd28c851f.herokuapp.com";
                                const response = await axios.post(
                                    `${API_URL}/api/ingredient/addingredient`,
                                    newIngredient
                                );
                                setAllIngredients((prev) => [...prev, response.data]);
                                setNewIngredient({ name: "", category: "" });
                            } catch (error) {
                                console.error("Error adding ingredient:", error);
                                setError("Failed to add new ingredient.");
                            }
                        }}
                    >
                        Add New Ingredient
                    </button>
                </div>

                <div className="input-group">
                    <label>Recipe:</label>
                    <textarea
                        value={recipe}
                        onChange={(e) => setRecipe(e.target.value)}
                        placeholder="Describe the cocktail recipe..."
                        required
                    />
                </div>

                <button type="submit">Save Cocktail</button>
            </form>
        </div>
    );
}

export default AddCocktail;
