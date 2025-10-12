export class Ingredients {
    constructor({ ingredient, quantity, unit = null }) {
        this.ingredient = ingredient;
        this.quantity = quantity;
        this.unit = unit;
    }
}
