import { CustumSelect, Options } from './class/CustumSelect.js';
import { Recipe } from './class/recipe.js';
import { SearchBar } from './class/SearchBar.js';
import { Tag } from './class/Tag.js';
import { tagType } from './constant.js';
import { RecipesRepository } from './data/RecipesRepository.js';
import { mapArray } from './function/array.js';
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
    onSearch: async (searchTerm) => {
        console.log(searchTerm);
        const { query, tag } = searchTerm;
        const ingredientsQuery = tag.has(tagType.ingredients) ? tag.get(tagType.ingredients) : [];
        const ustensilsQuery = tag.has(tagType.ustensils) ? tag.get(tagType.ustensils) : [];
        const applianceQuery = tag.has(tagType.appliance) ? tag.get(tagType.appliance) : [];
        const { recipes, ingredients, appliance, ustensils } = await RecipesRepository.search({ query, ingredientsQuery, ustensilsQuery, applianceQuery });
        ingredientSelect.setOptions(
            mapArray(
                ingredients,
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
            )
        );
        ustensilsSelect.setOptions(
            mapArray(
                ustensils,
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
            )
        );
        applianceSelect.setOptions(
            mapArray(
                appliance,
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
            )
        );
        displayRecipes(recipes, recipesContainer, numberContainer, searchTerm.query);
    },
    className: 'search-bar--main',
});
searchBarAchor.appendChild(searchBar.DOM);

const ingredientSelect = new CustumSelect({
    placeholder: 'Ingrédients',
    options: mapArray(
        ingredients,
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
    options: mapArray(
        appliance,
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
    options: mapArray(
        ustensils,
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
