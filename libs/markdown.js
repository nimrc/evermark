'use strict';

const MD    = require('markdown-it');
const juice = require('juice');
const hljs  = require('highlight.js');

class Markdown {
    constructor({ css }) {
        this.css = css;
        this.md  = new MD({
            highlight: this.highlight,
            xhtmlOut : true
        });

    }

    highlight(str, lang) {
        if (lang && hljs.getLanguage(lang))
            return hljs.highlight(lang, str).value;

        return '';
    }

    juice(content) {
        let html   = this.md.render(content);
        let juiced = juice(`<style>${this.css}</style>${html}`, { xmlMode: true });

        return juiced.replace(/class="(.*?)"/g, "");
    }
}

module.exports = Markdown;
