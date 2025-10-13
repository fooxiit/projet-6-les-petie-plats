import { Recipe } from './class/Recipe.js';

export class RecipesRepository {
    /**
     *
     * @returns {Promise<{recipes: Array, ingredients: Map, appliance: Map, ustensils: Map}>}
     */
    static async fetchRecipes() {
        if (this.recipes && this.ingredients && this.appliance && this.ustensils) return this.recipes;
        const { recipes: rowRecipes } = await (await fetch('./../data/recipes.json')).json();
        const { recipes, ingredients, appliance, ustensils } = rowRecipes.reduce(
            (acc, recipe) => {
                acc.recipes.push(new Recipe(recipe));
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
        this.recipes = recipes;
        this.ingredients = ingredients;
        this.appliance = appliance;
        this.ustensils = ustensils;
        return { recipes: this.recipes, ingredients: this.ingredients, appliance: this.appliance, ustensils: this.ustensils };
    }

    search({ query = '', ingredientsQuery = [], applianceQuery = [], ustensilsQuery = [] }) {
        const { recipes, ingredients, appliance, ustensils } = this.fetchRecipes();
        // implement search logic here

        return { recipes: recipes, ingredients: Array.from(ingredients.keys), appliance: Array.from(appliance.keys), ustensils: Array.from(ustensils.keys) };
    }

    constructor() {
        throw new Error('This class cannot be instantiated');
    }
}
