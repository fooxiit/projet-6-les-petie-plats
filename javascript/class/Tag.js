import { parseHttml } from '../function/parseHtml.js';

export class Tag {
    constructor({ type, name, id, onRemove = () => {} }) {
        this.type = type;
        this.name = name;
        this.id = id;
        this.onRemove = onRemove;
        this._DOM = null;
    }

    get DOM() {
        if (!this._DOM) {
            this._DOM = parseHttml(`
                    <div class='tag'>
                        <span class='tag__name'>${this.name}</span>
                        <i class="fa-solid fa-xmark tag__remove"></i>
                    </div>
                `);
            this._DOM.querySelector('.tag__remove').addEventListener('click', this.remove.bind(this));
        }
        return this._DOM;
    }

    remove() {
        this._DOM.remove();
        this.onRemove(this);
    }
}
