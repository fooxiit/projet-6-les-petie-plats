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

    open(e) {
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
        console.log('close', this.isOpen);
    }

    select(selected) {
        this.close();
        this.onSelect({ data: selected.data, value: selected.value });
    }

    setOptions(options) {
        this.options = options;
        const optionsContainer = this.DOM.querySelector('.custom-select__options');
        optionsContainer.innerHTML = '';
        this.options.forEach((option) => {
            const optionDOM = option.DOM;
            optionsContainer.appendChild(optionDOM);
            optionDOM.addEventListener('click', (e) => this.select(option));
        });
    }

    filtreOptions(searchTerm) {
        const { query } = searchTerm;
        const optionsContainer = this._DOM.querySelector('.custom-select__options');
        if (query === '') {
            this.displayOption(this.options, optionsContainer);
            return;
        }
        const filtredOption = this.options.filter((option) => option.value.toLowerCase().startsWith(query.toLowerCase()));
        this.displayOption(filtredOption, optionsContainer);
    }

    displayOption(options, optionsContainer) {
        optionsContainer.innerHTML = '';
        options.forEach((option) => {
            const optionDOM = option.DOM;
            optionsContainer.appendChild(optionDOM);
            optionDOM.addEventListener('click', (e) => {
                e.stopPropagation();
                this.select(option);
            });
        });
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
            this._DOM.addEventListener('click', (e) => this.open(e));
            const body = this._DOM.querySelector('.custom-select__body');
            const searchBar = new SearchBar({
                className: 'search-bar--select',
                onSearch: (searchTerm) => {
                    this.filtreOptions(searchTerm);
                },
            });
            body.appendChild(searchBar.DOM);
            const optionsContainer = parseHttml(`<div class='custom-select__options'></div>`);
            body.appendChild(optionsContainer);
            this.displayOption(this.options, optionsContainer);
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
