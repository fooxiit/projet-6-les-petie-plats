import { parseHttml } from '../function/parseHtml.js';

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
            if (e.target.value.length > 2) this.onSearch(e.target.value, this.abortController.signal);
        }, 200);
    }
}
