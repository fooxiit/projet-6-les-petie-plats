import { Ingredients } from './Ingredients';

export class Recipe {
    constructor({ id, image, name, ingredients = [], time, servings, description, appliance, ustensils }) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.ingredients = ingredients.map((ingredient) => new Ingredients(ingredient));
        this.time = time;
        this.servings = servings;
        this.description = description;
        this.appliance = appliance;
        this.ustensils = ustensils;
    }
    get imgSrc() {
        return `./../public/img/${this.image}`;
    }

    get ingredientsListDOM() {
        return this.ingredients.map((ingrdient) => `<li>${ingrdient.recipeDOM}</li>`).join('');
    }

    get DOM() {
        return `
            <div class='recipe recipe--card'>
                 div class='recipe__time'>${this.time}</div>
                <img src=${this.imgSrc}></img>
                <h2 class= 'recipe__title'>${this.name}</h2>
                <div class= 'recipe__description'>
                    <h3>RECETTE</h3>
                    <p>${this.description}</p>
                </div>
                <div class= 'recipe__ingredients'>
                    <h3>INGRÉDIENTS</h3>
                    <ul>
                        ${this.ingredientsListDOM}
                    </ul>
            </div>
        `;
    }
}
