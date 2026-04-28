import { languages } from '../../data/languages.js';

export class Settings {
    constructor(state, onUpdate) {
        this.state = state;
        this.onUpdate = onUpdate;
        this.template = document.getElementById('settings-template');
    }

    render() {
        const content = this.template.content.cloneNode(true);
        const themeSelect = content.querySelector('.pop-theme-select');
        const langSelect = content.querySelector('.pop-lang-select');
        const bgToggle = content.querySelector('.pop-bg-toggle');

        themeSelect.value = this.state.get('theme');
        bgToggle.checked = this.state.get('bg');
        
        langSelect.innerHTML = Object.keys(languages).map(k => 
            `<option value="${k}" ${k === this.state.get('lang') ? 'selected' : ''}>${languages[k].name}</option>`
        ).join('');

        themeSelect.onchange = (e) => this.onUpdate('theme', e.target.value);
        bgToggle.onchange = (e) => this.onUpdate('bg', e.target.checked);
        langSelect.onchange = (e) => this.onUpdate('lang', e.target.value);

        return content;
    }
}
 
