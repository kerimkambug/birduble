import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/addcocktail.css";

function AddCocktail() {
    const [cocktailName, setCocktailName] = useState("");
    const [ingredients, setIngredients] = useState([]); // Will hold ingredients with amount
    const [newIngredient, setNewIngredient] = useState({ name: "", category: "" });
    const [recipe, setRecipe] = useState("");
    const [allIngredients, setAllIngredients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [amount, setAmount] = useState(""); // Amount for selected ingredient
    const [selectedIngredient, setSelectedIngredient] = useState(null); // To hold the selected ingredient

    // Ingredient categories
    const ingredientCategories = [
        "alkol", "sebze", "soft", "baharat", "meyve", "şurup", "sos", "diğer"
    ];

    // Fetching ingredients from the database
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/ingredient/getallingredients");
                setAllIngredients(response.data.data); // Assuming the response contains a `data` field with ingredient list
            } catch (error) {
                console.error("Error fetching ingredients:", error);
                setError("Failed to fetch ingredients.");
            }
        };
        fetchIngredients();
    }, []);

    // Handle ingredient selection and amount input
    const handleIngredientAmountChange = (ingredientName, enteredAmount) => {
        setAmount(enteredAmount); // Update amount for the selected ingredient
        setSelectedIngredient(ingredientName); // Set the selected ingredient
    };

    const addIngredientToList = () => {
        if (selectedIngredient && amount) {
            setIngredients((prev) => [
                ...prev,
                { ingredient: selectedIngredient, amount },
            ]);
            setAmount(""); // Clear amount input after adding
            setSelectedIngredient(null); // Clear selected ingredient
        } else {
            setError("Please select an ingredient and enter an amount.");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cocktailName || ingredients.length === 0 || !recipe) {
            setError("Please fill out all fields.");
            return;
        }

        try {
            const cocktailData = {
                name: cocktailName,
                ingredients: ingredients, // ingredients is now an array of { ingredient, amount }
                recipe: recipe,
            };

            const response = await axios.post("http://localhost:8080/api/cocktail/addcocktail", cocktailData);
            console.log("Cocktail added:", response.data);
            // Reset form after successful submission
            setCocktailName("");
            setIngredients([]);
            setRecipe("");
            setSearchTerm("");
            setAmount(""); // Reset amount field
        } catch (error) {
            console.error("Error adding cocktail:", error);
            setError("Failed to add cocktail.");
        }
    };

    // Filter ingredients based on the search term
    const filteredIngredients = allIngredients.filter((ingredient) =>
        ingredient.name && ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())

    );


    return (
        <div className="add-cocktail">
            <h2>Add a New Cocktail</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                {/* Cocktail Name */}
                <div className="input-group">
                    <label>Cocktail Name:</label>
                    <input
                        type="text"
                        value={cocktailName}
                        onChange={(e) => setCocktailName(e.target.value)}
                        required
                    />
                </div>

                {/* Ingredient Search and Amount Input */}
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
                                onClick={() => {
                                    setSelectedIngredient(ingredient.name); // Set the selected ingredient
                                }}
                            >
                                {ingredient.name}
                            </div>
                        ))}
                    </div>

                    {/* Amount Input for the selected ingredient */}
                    {selectedIngredient && (
                        <div className="amount-input">
                            <label>Amount:</label>
                            <input
                                type="text"
                                placeholder="Enter amount (e.g., 40 ml)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)} // Allow user to edit amount
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

                {/* Added Ingredients Preview */}
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

                {/* Add New Ingredient Section */}
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
                                const response = await axios.post(
                                    "http://localhost:8080/api/ingredient/addingredient",
                                    newIngredient
                                );
                                console.log("New ingredient added:", response.data);
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

                {/* Recipe */}
                <div className="input-group">
                    <label>Recipe:</label>
                    <textarea
                        value={recipe}
                        onChange={(e) => setRecipe(e.target.value)}
                        placeholder="Describe the cocktail recipe..."
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit">Save Cocktail</button>
            </form>
        </div>
    );
}

export default AddCocktail;
