import { parseHttml } from '../function/parseHtml.js';
import { Tag } from './Tag.js';

export class SearchBar {
    constructor({
        placeholder = '',
        onSearch = (value) => {
            console.log(value);
        },
        className = '',
    } = {}) {
        this.placeholder = placeholder;
        this._DOM = null;
        this.onSearch = onSearch;
        this.timeout = null;
        this.className = className;
        this.abortController = new AbortController();
        this.query = '';
        this.tag = new Map();
    }
    get DOM() {
        if (!this._DOM) {
            this._DOM = parseHttml(`
            <div class='search-bar ${this.className}'>
                <input class='search-bar__input' type='text' placeholder='${this.placeholder}' />
                <i class="fa-solid fa-magnifying-glass search-bar__icon"></i>
            </div>`);
            const input = this._DOM.querySelector('.search-bar__input');
            input.addEventListener('input', (e) => this.debounce(e));
        }
        return this._DOM;
    }

    debounce(e) {
        this.abortController.abort();
        this.abortController = new AbortController();
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.query = e.target.value;
            this.search();
        }, 200);
    }

    search() {
        this.onSearch({ query: this.query, tag: this.tag });
    }

    /**
     *
     * @param {Tag} tag
     */
    addTag(tag) {
        if (this.tag.has(tag.type)) {
            this.tag.get(tag.type).add(tag.id);
        } else {
            this.tag.set(tag.type, new Set([tag.id]));
        }
        this.search();
    }

    removeTag(tag) {
        console.log(this.tag.get(tag.type));
        this.tag.get(tag.type)?.delete(tag.id);
        this.search();
    }
}
