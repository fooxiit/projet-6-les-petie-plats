import { CustumSelect, Options } from './class/CustumSelect.js';
import { Recipe } from './class/recipe.js';
import { SearchBar } from './class/SearchBar.js';
import { Tag } from './class/Tag.js';
import { tagType } from './constant.js';
import { RecipesRepository } from './data/RecipesRepository.js';
import { displayRecipes } from './function/displayRicipes.js';
import { parseHttml } from './function/parseHtml.js';

const searchBarAchor = document.querySelector('#search-bar-anchor');
const recipesContainer = document.querySelector('#recipes-container');
const numberContainer = document.querySelector('#number-recipes-anchor');
const tagAnchor = document.querySelector('#tag-anchor');
const selectAnchor = document.querySelector('#select-anchor');
const { recipes, ingredients, appliance, ustensils } = await RecipesRepository.search();

const searchBar = new SearchBar({
    placeholder: 'Rechercher une recette, un ingrédient, ...',
    onSearch: (searchTerm) => {
        console.log(searchTerm);
    },
    className: 'search-bar--main',
});
searchBarAchor.appendChild(searchBar.DOM);

const ingredientSelect = new CustumSelect({
    placeholder: 'Ingrédients',
    options: ingredients.map(
        (ing) =>
            new Options({
                value: ing,
                label: ing,
                data: new Tag({
                    type: tagType.ingredients,
                    name: ing,
                    id: ing,
                    onRemove: (tag) => {
                        searchBar.removeTag(tag);
                    },
                }),
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
    options: appliance.map(
        (app) =>
            new Options({
                value: app,
                label: app,
                data: new Tag({
                    type: tagType.appliance,
                    name: app,
                    id: app,
                    onRemove: (tag) => {
                        searchBar.removeTag(tag);
                    },
                }),
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
    options: ustensils.map(
        (ust) =>
            new Options({
                value: ust,
                label: ust,
                data: new Tag({
                    type: tagType.ustensils,
                    name: ust,
                    id: ust,
                    onRemove: (tag) => {
                        searchBar.removeTag(tag);
                    },
                }),
            })
    ),
    onSelect: (selected) => {
        searchBar.addTag(selected.data);
        tagAnchor.appendChild(selected.data.DOM);
    },
});
selectAnchor.appendChild(ustensilsSelect.DOM);

displayRecipes(recipes, recipesContainer, numberContainer);
