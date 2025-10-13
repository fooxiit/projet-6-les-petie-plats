import { CustumSelect, Options } from './class/CustumSelect.js';
import { SearchBar } from './class/searchBar.js';
import { RecipesRepository } from './data/RecipesRepository.js';

const searchBarAchor = document.querySelector('#search-bar-anchor');
const recipesContainer = document.querySelector('#recipes-container');
const extendedSearch = document.querySelector('#extended-search');
const { recipes, ingredients, appliance, ustensils } = RecipesRepository.search();

const searchBar = new SearchBar({ placeholder: 'Rechercher une recette, un ingrédient, ...', onSearch: () => {} });
searchBarAchor.appendChild(searchBar.DOM);

const ingredientSelect = new CustumSelect({ placeholder: 'Ingrédients', options: ingredients.map((ing) => new Options({ value: ing, label: ing })) });
extendedSearch.appendChild(ingredientSelect.DOM);

const applianceSelect = new CustumSelect({ placeholder: 'Appareils', options: appliance.map((app) => new Options({ value: app, label: app })) });
extendedSearch.appendChild(applianceSelect.DOM);

const ustensilsSelect = new CustumSelect({ placeholder: 'Ustensiles', options: ustensils.map((ust) => new Options({ value: ust, label: ust })) });
extendedSearch.appendChild(ustensilsSelect.DOM);

for (const recipe of recipes) {
    recipesContainer.appendChild(recipe.DOM);
}
