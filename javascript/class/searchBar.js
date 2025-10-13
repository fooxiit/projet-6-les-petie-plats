export class SearchBar {
    constructor({ placeholder = '', onSearch = () => {} }) {
        this.placeholder = placeholder;
        this._DOM = null;
        this.onSearch = onSearch;
        this.timeout = null;
    }
    get DOM() {
        if (!this._DOM) {
            this._DOM = parseHttml(`
            <div class='search-bar'>
                <input class='search-bar__input' type='text' placeholder='${this.placeholder}' />
                <i class="fa-solid fa-magnifying-glass search-bar__icon"></i>
            </div>`);
            const input = this._DOM.querySelector('.search-bar__input');
            input.addEventListener('input', (e) => this.debounce(e));
        }
        return this._DOM;
    }

    debounce(e) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.onSearch(e.taget.value);
        }, 150);
    }
}
