import { parseHttml } from '../function/parseHtml.js';

export class Ingredients {
    constructor({ ingredient, quantity, unit = null }) {
        this.ingredient = ingredient;
        this.quantity = quantity;
        this.unit = unit;
    }

    get quantityUnit() {
        if (this.unit) return `${this.quantity}${this.unit}`;
        return this.quantity;
    }

    get recipeDOM() {
        return parseHttml(`
            div class= 'recipe__ingredient ingredient'>
                <span class= 'ingredient__name'>${this.ingredient}</span>
                span class= 'ingredient__quantity'>${this.quantityUnit}</span>
            </div>
        `);
    }
}
