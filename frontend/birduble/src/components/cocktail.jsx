import React from 'react';
import "../styles/cocktail.css";

const Cocktail = ({ cocktail }) => {
    return (
        <div className="cocktail">
            <h2>{cocktail.name}</h2>
            <img src={`./${cocktail.name}.jpg`} alt={cocktail.name} />
            <ul>
                {cocktail.ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.amount} {ingredient.ingredient}
                    </li>
                ))}
            </ul>
            <p><strong>Instructions:</strong> {cocktail.recipe}</p>
        </div>
    );
};

export default Cocktail;
