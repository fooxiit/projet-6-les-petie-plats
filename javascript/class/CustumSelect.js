import { parseHttml } from '../function/parseHtml';
import { SearchBar } from './searchBar';

export class CustumSelect {
    constructor({ placeholder, options = [], filter = true, onSelect = () => {} }) {
        this.placeholder = placeholder;
        this.options = options;
        this.filter = filter;
        this._DOM = null;
        this.onSelect = onSelect;
    }

    open() {
        const body = this._DOM.querySelector('.custom-select__body');
        const searchBar = new SearchBar({
            onSearch: (searchTerm) => {
                this.filtreOptions(searchTerm);
            },
        });
        body.appendChild(searchBar.DOM);
        this.options.forEach((option) => {
            body.appendChild(option.DOM);
            option.DOM.addEventListener('click', () => this.select(option));
        });
    }

    select(selected) {
        this.onSelect(selected.dataset.value);
    }

    setOptions(options) {
        this.options = options;
    }

    filtreOptions(searchTerm) {
        //implement filtre
    }

    get DOM() {
        if (!this._DOM) {
            this._DOM = parseHttml(`
                <div class='custom-select'>
                    <div class='custom-select__placeholder'>${this.placeholder}</div>
                    <div class= 'custom-select__body'></div>
                </div>`);
        }
        return this._DOM;
    }
}

export class options {
    constructor({ value, label }) {
        this.value = value;
        this.label = label;
    }
    get DOM() {
        return parseHttml(`div class='custom-select__option' data-value='${this.value}'>${this.label}</div`);
    }
}
