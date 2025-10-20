import { Query } from '../class/Query.js';
import { Recipe } from '../class/recipe.js';
import { stopWords, tagType } from '../constant.js';

export class RecipesRepository {
    /**
     *
     * @returns {Promise<{recipes: Array, ingredients: Map, appliance: Map, ustensils: Map}>}
     */
    static async fetchRecipes() {
        if (this.recipes && this.ingredients && this.appliance && this.ustensils) return { recipes: this.recipes, ingredients: this.ingredients, appliance: this.appliance, ustensils: this.ustensils };
        const { recipes: rowRecipes } = await (await fetch('./../data/recipes.json')).json();
        const { recipes, ingredients, appliance, ustensils } = rowRecipes.reduce(
            (acc, recipe) => {
                const recipeObject = new Recipe(recipe);
                acc.recipes.push(recipeObject);
                recipe.ingredients.forEach((ing) => {
                    if (!acc.ingredients.has(ing.ingredient)) acc.ingredients.set(ing.ingredient, [recipe.id]);
                    else acc.ingredients.get(ing.ingredient).push(recipe.id);
                });

                if (!acc.appliance.has(recipe.appliance)) acc.appliance.set(recipe.appliance, [recipe.id]);
                else acc.appliance.get(recipe.appliance).push(recipe.id);

                recipe.ustensils.forEach((ust) => {
                    if (!acc.ustensils.has(ust)) acc.ustensils.set(ust, [recipe.id]);
                    else acc.ustensils.get(ust).push(recipe.id);
                });
                return acc;
            },
            { recipes: [], ingredients: new Map(), appliance: new Map(), ustensils: new Map() }
        );
        //console.log(recipes, ingredients, appliance, ustensils);
        this.recipes = recipes;
        this.ingredients = ingredients;
        this.appliance = appliance;
        this.ustensils = ustensils;
        return { recipes: this.recipes, ingredients: this.ingredients, appliance: this.appliance, ustensils: this.ustensils };
    }

    static async search(query = new Query()) {
        const { recipes, ingredients, appliance, ustensils } = await this.fetchRecipes();
        const { query: queryString, tags } = query;
        const queryDeconpose = queryString.split(/\s|,/gm).filter((word) => !stopWords.has(word));
        if (queryString.length < 3 && !checkIfHasTag(tags)) {
            return { recipes: recipes, ingredients: Array.from(ingredients.keys()), appliance: Array.from(appliance.keys()), ustensils: Array.from(ustensils.keys()) };
        }
        // implement search logic here
        const { recipesFiltred, ingredientsFiltred, appliancesFiltred, ustensilsFiltred } = recipes.reduce(
            (acc, recipe) => {
                if (queryMatch(recipe, queryString) || queryString.length < 3) {
                    const ingredientSet = recipe.ingredients.reduce((acc, ingredient) => {
                        acc.add(ingredient.ingredient);
                        return acc;
                    }, new Set());
                    const ustensilSet = recipe.ustensils.reduce((acc, ustensil) => {
                        acc.add(ustensil);
                        return acc;
                    }, new Set());
                    if (checkIfHasTag(tags) && !(applianceMatch(tags, recipe.appliance) && ingredientsMatch(tags, ingredientSet) && ustensilsMatch(tags, ustensilSet))) {
                        return acc;
                    }
                    acc.recipesFiltred.push(recipe);

                    const ingredientsTag = tags.get(tagType.ingredients);
                    if (ingredientsTag) {
                        acc.ingredientsFiltred = ingredientsTag.symmetricDifference(acc.ingredientsFiltred.union(ingredientSet));
                    } else {
                        acc.ingredientsFiltred = acc.ingredientsFiltred.union(ingredientSet);
                    }

                    const ustensilsTag = tags.get(tagType.ustensils);
                    if (ustensilsTag) {
                        acc.ustensilsFiltred = ustensilsTag.symmetricDifference(acc.ustensilsFiltred.union(ustensilSet));
                    } else {
                        acc.ustensilsFiltred = acc.ustensilsFiltred.union(ustensilSet);
                    }
                    if (tags.get(tagType.appliance)?.has(recipe.appliance)) return acc;
                    acc.appliancesFiltred.add(recipe.appliance);
                }
                return acc;
            },
            { recipesFiltred: [], ingredientsFiltred: new Set(), appliancesFiltred: new Set(), ustensilsFiltred: new Set() }
        );

        return {
            recipes: recipesFiltred,
            ingredients: Array.from(ingredientsFiltred.keys()),
            appliance: Array.from(appliancesFiltred.keys()),
            ustensils: Array.from(ustensilsFiltred.keys()),
        };
    }

    constructor() {
        throw new Error('This class cannot be instantiated');
    }
}
/**
 *
 * @param {Recipe} recipe
 * @param {Query} query
 * @returns {Boolean}
 */
function queryMatch(recipe, query) {
    const { description, name, ingredients } = recipe;

    return description.toLowerCase().includes(query) || name.toLowerCase().includes(query) || ingredients.some((ingredient) => ingredient.ingredient.includes(query));
}

function applianceMatch(tags, recipeApliance) {
    const applianceTags = tags.get(tagType.appliance);
    if (!applianceTags) return true;
    return applianceTags.has(recipeApliance);
}

function ingredientsMatch(tags, recipeIngredients) {
    const ingredientsTags = tags.get(tagType.ingredients);
    if (!ingredientsTags) return true;

    return ingredientsTags.isSubsetOf(recipeIngredients);
}

function ustensilsMatch(tags, recipeUstensils) {
    const ustensilsTags = tags.get(tagType.ustensils);
    if (!ustensilsTags) return true;
    return ustensilsTags.isSubsetOf(recipeUstensils);
}

/**
 *
 * @param {Map} tag
 */
function checkIfHasTag(tags) {
    if (tags.size === 0) return false;
    let isEmpty = true;
    tags.forEach((tag) => {
        isEmpty = tag.size === 0;
    });
    return !isEmpty;
}
