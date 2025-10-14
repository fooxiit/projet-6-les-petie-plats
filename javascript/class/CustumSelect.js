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
        this.abortController = new AbortController();
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        this._DOM.classList.add('custom-select--open');
        document.addEventListener(
            'click',
            (e) => {
                if (!this._DOM.contains(e.target)) this.close();
            },
            { signal: this.abortController.signal }
        );
    }

    close() {
        if (!this.isOpen) return;
        this.abortController.abort();
        this.abortController = new AbortController();
        this.isOpen = false;
        this._DOM.classList.remove('custom-select--open');
    }

    select(selected) {
        this.close();
        this.onSelect({ data: selected.data, value: selected.value });
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
                optionDOM.addEventListener('click', (e) => this.select(option));
            });
            body.appendChild(optionsContainer);
        }
        return this._DOM;
    }
}

export class Options {
    constructor({ value, label, data }) {
        this.value = value;
        this.label = label;
        this.data = data;
    }
    get DOM() {
        return parseHttml(`<div class='custom-select__option' data-value='${this.value}'>${this.label}</div>`);
    }
}
