import { Recipe } from '../class/recipe.js';
import { parseHttml } from './parseHtml.js';

/**
 *
 * @param {Array<Recipe>} recipes
 * @param {HTMLElement} recipesContainer
 * @param {HTMLElement} numberContainer
 */
export function displayRecipes(recipes, recipesContainer, numberContainer, searchTerm = '') {
    recipesContainer.innerHTML = '';
    if (recipes.length > 0) {
        for (const recipe of recipes) {
            recipesContainer.appendChild(recipe.DOM);
        }
    } else {
        const notFound = parseHttml(`<span> Aucune recette ne contient « ${searchTerm} »  vous pouvez chercher «tarte aux pommes », « poisson », etc</<span>`);
        recipesContainer.appendChild(notFound);
    }
    numberContainer.innerHTML = '';
    const numberOfRecipes = parseHttml(`<span>${recipes.length} recettes</span>`);
    numberContainer.appendChild(numberOfRecipes);
}
