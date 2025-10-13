import { parseHttml } from '../function/parseHtml.js';
import { Ingredients } from './Ingredients.js';

export class Recipe {
    constructor({ id, image, name, ingredients = [], time, servings, description, appliance, ustensils }) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.ingredients = ingredients.map((ingredient) => new Ingredients(ingredient));
        this._time = time;
        this.servings = servings;
        this.description = description;
        this.appliance = appliance;
        this.ustensils = ustensils;
    }
    get imgSrc() {
        return `public/img/${this.image}`;
    }

    get time() {
        return `${this._time} min`;
    }

    get ingredientsListDOM() {
        return this.ingredients.map((ingrdient) => `<li>${ingrdient.recipeDOM.outerHTML}</li>`).join('');
    }

    get DOM() {
        return parseHttml(`
            <div class='recipe recipe--card'>
                <div class='recipe__header'>
                    <div class='recipe__time'>${this.time}</div>
                    <img src=${this.imgSrc}>
                </div>
                <div class=' recipe__body'>
                    <h2 class= 'recipe__title'>${this.name}</h2>
                    <div class= 'recipe__part recipe__description'>
                        <h3>RECETTE</h3>
                        <p>${this.description}</p>
                    </div>
                    <div class= 'recipe__part recipe__ingredients'>
                        <h3>INGRÉDIENTS</h3>
                        <ul id='${this.id}-ingredients' class='recipe__ingredients-list'>
                            ${this.ingredientsListDOM}
                        </ul>
                    </div>
                </div>
            </div>
        `);
    }
}
