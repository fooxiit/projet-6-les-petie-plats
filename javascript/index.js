import { CustumSelect, Options } from './class/CustumSelect.js';
import { Recipe } from './class/recipe.js';
import { SearchBar } from './class/SearchBar.js';
import { Tag } from './class/Tag.js';
import { tagType } from './constant.js';
import { RecipesRepository } from './data/RecipesRepository.js';
import { parseHttml } from './function/parseHtml.js';
import { displayRecipes } from './function/displayRecipes.js';
import { applianceToOption, ingredientToOption, ustensilToOption } from './function/toOption.js';

const searchBarAchor = document.querySelector('#search-bar-anchor');
const recipesContainer = document.querySelector('#recipes-container');
const numberContainer = document.querySelector('#number-recipes-anchor');
const tagAnchor = document.querySelector('#tag-anchor');
const selectAnchor = document.querySelector('#select-anchor');
const { recipes, ingredients, appliance, ustensils } = await RecipesRepository.search();

const ingredientSelect = new CustumSelect({
    placeholder: 'Ingrédients',
    options: ingredients.map((ing) =>
        ingredientToOption(ing, (tag) => {
            searchBar.removeTag(tag);
        })
    ),
    onSelect: (selected) => {
        searchBar.addTag(selected.data);
        tagAnchor.appendChild(selected.data.DOM);
    },
});
selectAnchor.appendChild(ingredientSelect.DOM);

const applianceSelect = new CustumSelect({
    placeholder: 'Appareils',
    options: appliance.map((app) =>
        applianceToOption(app, (tag) => {
            searchBar.removeTag(tag);
        })
    ),
    onSelect: (selected) => {
        searchBar.addTag(selected.data);
        tagAnchor.appendChild(selected.data.DOM);
    },
});
selectAnchor.appendChild(applianceSelect.DOM);

const ustensilsSelect = new CustumSelect({
    placeholder: 'Ustensiles',
    options: ustensils.map((ust) =>
        ustensilToOption(ust, (tag) => {
            searchBar.removeTag(tag);
        })
    ),
    onSelect: (selected) => {
        searchBar.addTag(selected.data);
        tagAnchor.appendChild(selected.data.DOM);
    },
});
selectAnchor.appendChild(ustensilsSelect.DOM);

const searchBar = new SearchBar({
    placeholder: 'Rechercher une recette, un ingrédient, ...',
    onSearch: async (searchTerm) => {
        const { recipes, ingredients, appliance, ustensils } = await RecipesRepository.search(searchTerm);
        ustensilsSelect.setOptions(
            ustensils.map((ustensil) =>
                ustensilToOption(ustensil, (tag) => {
                    searchBar.removeTag(tag);
                })
            )
        );
        applianceSelect.setOptions(
            appliance.map((ustensil) =>
                applianceToOption(ustensil, (tag) => {
                    searchBar.removeTag(tag);
                })
            )
        );

        ingredientSelect.setOptions(
            ingredients.map((ingredient) =>
                ingredientToOption(ingredient, (tag) => {
                    searchBar.removeTag(tag);
                })
            )
        );
        displayRecipes(recipesContainer, recipes);
    },
    className: 'search-bar--main',
});
searchBarAchor.appendChild(searchBar.DOM);

displayRecipes(recipesContainer, recipes);
displayRecipes(recipes, recipesContainer, numberContainer);

/**
 *
 * @param {Array<Recipe>} recipes
 * @param {HTMLElement} recipesContainer
 * @param {HTMLElement} numberContainer
 */
function displayRecipes(recipes, recipesContainer, numberContainer, searchTerm = '') {
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
