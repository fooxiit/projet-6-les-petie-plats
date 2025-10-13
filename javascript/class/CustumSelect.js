import { parseHttml } from '../function/parseHtml.js';
import { SearchBar } from './SearchBar.js';

export class CustumSelect {
    constructor({
        placeholder,
        options = [],
        filter = true,
        onSelect = (value) => {
            console.log(value);
        },
    }) {
        this.placeholder = placeholder;
        this.options = options;
        this.filter = filter;
        this._DOM = null;
        this.onSelect = onSelect;
        this.isOpen = false;
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        this._DOM.classList.add('custom-select--open');
        this._DOM.addEventListener('blur', this.close.bind(this), { once: true });
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this._DOM.classList.remove('custom-select--open');
    }

    select(selected) {
        this.close();
        this.onSelect(selected.target.dataset.value);
    }

    setOptions(options) {
        this.options = options;
    }

    filtreOptions(searchTerm) {
        console.log(searchTerm);
        //implement filtre
    }

    get DOM() {
        if (!this._DOM) {
            this._DOM = parseHttml(`
                <div class='custom-select' tabindex='-1'>
                    <div class='custom-select__placeholder'>
                       <span> ${this.placeholder}</span>
                        <i class="fa-solid fa-chevron-down custom-select__icon"></i>
                    </div>
                    <div class= 'custom-select__body'></div>
                </div>`);
            this._DOM.querySelector('.custom-select__placeholder').addEventListener('click', () => this.open());
            const body = this._DOM.querySelector('.custom-select__body');
            const searchBar = new SearchBar({
                className: 'search-bar--select',
                onSearch: (searchTerm) => {
                    this.filtreOptions(searchTerm);
                },
            });
            body.appendChild(searchBar.DOM);
            const optionsContainer = parseHttml(`<div class='custom-select__options'></div>`);
            this.options.forEach((option) => {
                const optionDOM = option.DOM;
                optionsContainer.appendChild(optionDOM);
                optionDOM.addEventListener('click', (e) => this.select(e));
            });
            body.appendChild(optionsContainer);
        }
        return this._DOM;
    }
}

export class Options {
    constructor({ value, label }) {
        this.value = value;
        this.label = label;
    }
    get DOM() {
        return parseHttml(`<div class='custom-select__option' data-value='${this.value}'>${this.label}</div>`);
    }
}
