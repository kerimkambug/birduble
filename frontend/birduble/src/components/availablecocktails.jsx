import React from 'react';
import Cocktail from './cocktail';

function AvailableCocktails({ availablecocktails }) {
    return (
        <div className="available-cocktail-list">
            {
                availablecocktails.map((cocktail, index) => (
                    <Cocktail key={index} cocktail={cocktail} />
                ))
            }
        </div>
    );
}

export default AvailableCocktails;
