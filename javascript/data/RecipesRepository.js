import { Recipe } from '../class/recipe.js';
import { Tag } from '../class/Tag.js';
import { tagType } from '../constant.js';
import { arrayReduce, findInArray, forEachElementInArray } from '../function/array.js';
import { stringContain } from '../function/string.js';

export class RecipesRepository {
    /**
     *
     * @returns {Promise<{recipes: Array, ingredients: Map, appliance: Map, ustensils: Map}>}
     */
    static async fetchRecipes() {
        if (this.recipes && this.ingredients && this.appliance && this.ustensils) return { recipes: this.recipes, ingredients: this.ingredients, appliance: this.appliance, ustensils: this.ustensils };
        const { recipes: rowRecipes } = await (await fetch('./../data/recipes.json')).json();
        const { recipes, ingredients, appliance, ustensils } = arrayReduce(
            rowRecipes,
            (acc, recipe) => {
                acc.recipes.push(new Recipe(recipe));
                forEachElementInArray(recipe.ingredients, (ing) => {
                    if (!findInArray(acc.ingredients, (ingredient) => ingredient === ing.ingredient)[0]) acc.ingredients.push(ing.ingredient);
                });

                if (!findInArray(acc.appliance, (appliance) => appliance === recipe.appliance)[0]) acc.appliance.push(recipe.appliance);

                forEachElementInArray(recipe.ustensils, (ust) => {
                    if (!findInArray(acc.ustensils, (ustensil) => ustensil === ust)) acc.ustensils.push(ust);
                });
                return acc;
            },
            { recipes: [], ingredients: [], appliance: [], ustensils: [] }
        );
        this.recipes = recipes;
        this.ingredients = ingredients;
        this.appliance = appliance;
        this.ustensils = ustensils;
        return { recipes: this.recipes, ingredients: this.ingredients, appliance: this.appliance, ustensils: this.ustensils };
    }

    static async search({ query = '', ingredientsQuery = [], applianceQuery = [], ustensilsQuery = [] } = {}) {
        const { recipes, ingredients, appliance, ustensils } = await this.fetchRecipes();
        if (query.length > 2 || ingredientsQuery.length > 0 || applianceQuery.length > 0 || ustensilsQuery > 0) {
            const { recipesFiltred, ingredientsFiltred, applianceFiltred, ustensilsFiltred } = arrayReduce(
                recipes,
                (acc, recipe) => {
                    console.log(recipe.name, '--start--');
                    if (
                        searchRecipeByText(query.toLocaleLowerCase(), recipe) &&
                        searchRecipeByTag(ingredientsQuery, tagType.ingredients, recipe) &&
                        searchRecipeByTag(ustensilsQuery, tagType.ustensils, recipe) &&
                        searchRecipeByTag(applianceQuery, tagType.appliance, recipe)
                    ) {
                        acc.recipesFiltred.push(recipe);
                        forEachElementInArray(recipe.ingredients, (ing) => {
                            if (
                                !findInArray(acc.ingredientsFiltred, (ingredient) => ingredient === ing.ingredient)[0] &&
                                !findInArray(ingredientsQuery, (ingredientQuery) => ingredientQuery === ing.ingredient)[0]
                            ) {
                                acc.ingredientsFiltred.push(ing.ingredient);
                            }
                        });

                        if (!findInArray(acc.applianceFiltred, (appliance) => appliance === recipe.appliance)[0] && !findInArray(applianceQuery, (appQuery) => appQuery === recipe.appliance)[0]) {
                            acc.applianceFiltred.push(recipe.appliance);
                        }

                        forEachElementInArray(recipe.ustensils, (ust) => {
                            if (!findInArray(acc.ustensilsFiltred, (ustensil) => ustensil === ust)[0] && !findInArray(ustensilsQuery, (ustensilQuery) => ustensilQuery === ust)[0]) {
                                acc.ustensilsFiltred.push(ust);
                            }
                        });
                    }
                    console.log(recipe.name, '--end--');
                    return acc;
                },
                { recipesFiltred: [], ingredientsFiltred: [], applianceFiltred: [], ustensilsFiltred: [] }
            );
            return { recipes: recipesFiltred, ingredients: ingredientsFiltred, appliance: applianceFiltred, ustensils: ustensilsFiltred };
        }
        return { recipes: recipes, ingredients: ingredients, appliance: appliance, ustensils: ustensils };
    }

    constructor() {
        throw new Error('This class cannot be instantiated');
    }
}
/**
 *
 * @param {String} query
 * @param {Recipe} recipe
 * @returns
 */
function searchRecipeByText(query, recipe) {
    if (query.length < 3) return true;
    return (
        stringContain(recipe.name.toLocaleLowerCase(), query) ||
        stringContain(recipe.description.toLocaleLowerCase(), query) ||
        findInArray(recipe.ingredients, (ing) => stringContain(ing.ingredient.toLocaleLowerCase(), query))[0]
    );
}
/**
 *
 * @param {Array<Tag>} tags
 * @param {String} type
 * @param {Recipe} recipe
 * @returns {Boolean}
 */
function searchRecipeByTag(tags, type, recipe) {
    if (tags.length === 0) return true;
    switch (type) {
        case tagType.appliance:
            return findInArray(tags, (tag) => tag === recipe.appliance)[0];
        case tagType.ingredients:
            return findInArray(tags, (tag) => {
                const res = findInArray(recipe.ingredients, (ingredient) => {
                    console.log(tag, '/', ingredient.id, tag === ingredient.id);
                    return tag === ingredient.id;
                })[0];
                return res;
            })[0];
        case tagType.ustensils:
            return findInArray(tags, (tag) => findInArray(recipe.ustensils, (ust) => tag === ust)[0])[0];

        default:
            throw new Error('unkown tag type');
    }
}
