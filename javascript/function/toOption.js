import { Options } from '../class/CustumSelect.js';
import { Tag } from '../class/Tag.js';
import { tagType } from '../constant.js';

export function ingredientToOption(ing, onRemove) {
    return new Options({
        value: ing,
        label: ing,
        data: new Tag({
            type: tagType.ingredients,
            name: ing,
            id: ing,
            onRemove: onRemove,
        }),
    });
}

export function applianceToOption(app, onRemove) {
    return new Options({
        value: app,
        label: app,
        data: new Tag({
            type: tagType.appliance,
            name: app,
            id: app,
            onRemove: onRemove,
        }),
    });
}

export function ustensilToOption(ust, onRemove) {
    return new Options({
        value: ust,
        label: ust,
        data: new Tag({
            type: tagType.ustensils,
            name: ust,
            id: ust,
            onRemove: onRemove,
        }),
    });
}
