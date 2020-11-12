'use strict';

const Evernote = require('evernote');
const logger   = require('./logger');

class Yinxiang {
    constructor(options) {
        this.client    = new Evernote.Client(options);
        this.userStore = this.client.getUserStore();
        this.noteStore = this.client.getNoteStore();

        this.filter = new Evernote.NoteStore.NoteFilter();
        this.spec   = new Evernote.NoteStore.NotesMetadataResultSpec({
            includeTitle        : true,
            includeNotebookGuid : true,
            includeUpdated      : true,
            includeContentLength: true
        });
    }

    async sync() {
        this.notebooks = await this.noteStore.listNotebooks();
        this.guids     = {};

        let { startIndex, totalNotes, notes } = await this.noteStore.findNotesMetadata(this.filter, 0, 10000, this.spec);

        this.startIndex = startIndex;
        this.totalNotes = totalNotes;
        this.notes      = notes;

        notes.map(note => this.guids[note.guid] = note);

        logger.info(`Sync success, total notes: ${this.totalNotes}`);
    }

    async getNoteGuid(name) {
        let note = this.notes.filter(({ title }) => title === name);
        return note.length > 0 ? note[0].guid : null;
    }

    async getNotebookGuid(bookname) {
        let notebooks = this.notebooks.filter(({ name }) => name === bookname);

        if (notebooks.length === 0) {
            let notebook = await this.createNotebook(bookname);
            this.notebooks.push(notebook);

            logger.info(`Create new notebook [${bookname}], guid: ${notebook.guid}`);

            return notebook.guid;
        }

        return notebooks[0].guid;
    }

    async createNotebook(name) {
        let notebook = new Evernote.Types.Notebook({
            name,
            defaultNotebook: false
        });

        return this.noteStore.createNotebook(notebook);
    }

    async createNote(mark, html, guid) {
        let note = await this.getNote(mark, html, guid);

        return this.noteStore.createNote(note);
    }

    async updateNote(mark, html, guid) {
        let note = await this.getNote(mark, html, guid);

        return this.noteStore.updateNote(note);
    }

    async getNote(mark, html, notebookGuid) {
        const noteAttrs        = new Evernote.Types.NoteAttributes();
        noteAttrs.contentClass = 'ting';

        const note = new Evernote.Types.Note({ attributes: noteAttrs });

        note.content = '<?xml version="1.0" encoding="UTF-8"?>' +
                       '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">' +
                       `<en-note>${html}</en-note>`;

        note.guid         = await this.getNoteGuid(mark.name);
        note.title        = mark.name;
        note.notebookGuid = notebookGuid;

        return note;
    }
}

module.exports = Yinxiang;
