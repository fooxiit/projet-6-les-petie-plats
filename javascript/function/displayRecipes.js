import { Recipe } from '../class/recipe.js';

/**
 *
 * @param {HTMLElement} anchor
 * @param {Array<Recipe>} recipes
 */
export function displayRecipes(anchor, recipes) {
    anchor.innerHTML = '';
    for (const recipe of recipes) {
        anchor.appendChild(recipe.DOM);
    }
}
