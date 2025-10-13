import { CustumSelect, Options } from './class/CustumSelect.js';
import { SearchBar } from './class/SearchBar.js';
import { RecipesRepository } from './data/RecipesRepository.js';

const searchBarAchor = document.querySelector('#search-bar-anchor');
const recipesContainer = document.querySelector('#recipes-container');
const extendedSearch = document.querySelector('#extended-search');
const selectAnchor = document.querySelector('#select-anchor');
const { recipes, ingredients, appliance, ustensils } = await RecipesRepository.search();

const searchBar = new SearchBar({ placeholder: 'Rechercher une recette, un ingrédient, ...', onSearch: () => {}, className: 'search-bar--main' });
searchBarAchor.appendChild(searchBar.DOM);

const ingredientSelect = new CustumSelect({ placeholder: 'Ingrédients', options: ingredients.map((ing) => new Options({ value: ing, label: ing })) });
selectAnchor.appendChild(ingredientSelect.DOM);

const applianceSelect = new CustumSelect({ placeholder: 'Appareils', options: appliance.map((app) => new Options({ value: app, label: app })) });
selectAnchor.appendChild(applianceSelect.DOM);

const ustensilsSelect = new CustumSelect({ placeholder: 'Ustensiles', options: ustensils.map((ust) => new Options({ value: ust, label: ust })) });
selectAnchor.appendChild(ustensilsSelect.DOM);

for (const recipe of recipes) {
    recipesContainer.appendChild(recipe.DOM);
}
