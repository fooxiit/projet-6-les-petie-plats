import { parseHttml } from '../function/parseHtml.js';
import { Query } from './Query.js';
import { Tag } from './Tag.js';

export class SearchBar {
    constructor({
        placeholder = '',
        onSearch = (value) => {
            console.info(value);
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
        this.tags = new Map();
        this.debounceTime = 200;
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
        }, this.debounceTime);
    }

    search() {
        this.onSearch(new Query(this.query.toLocaleLowerCase(), this.tags));
    }

    /**
     *
     * @param {Tag} tag
     */
    addTag(tag) {
        if (this.tags.has(tag.type)) {
            this.tags.get(tag.type).add(tag.id);
        } else {
            this.tags.set(tag.type, new Set([tag.id]));
        }
        this.search();
    }

    removeTag(tag) {
        this.tags.get(tag.type)?.delete(tag.id);
        if (this.tags.get(tag.type)?.size < 1) this.tags.delete(tag.type);
        this.search();
    }
}
