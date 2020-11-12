'use strict';

const fs           = require('./fs');
const logger       = require('./logger');
const { encoding } = require('../config');

class Sync {
    constructor({ client, md }) {
        this.client = client;
        this.md     = md;
    }

    async exec(doc) {
        let mf = await fs.readfile(doc);

        await this.checkMtime(mf);
    }

    async checkMtime(doc) {
        let guid = await this.client.getNoteGuid(doc.name);

        if (guid !== null) {
            let note        = this.client.guids[guid];
            let { updated } = note;

            await this.updateNote(doc);
        } else {
            await this.createNote(doc.path.split('/').pop(), doc);
        }
    }

    async createNote(notebook, doc) {
        logger.info(`Start to create new note, [${notebook}] ${doc.name}`);

        let guid = await this.client.getNotebookGuid(notebook);

        logger.info(`Get notebook [${notebook}] guid: ${guid}`);

        try {
            let html   = await this.getHtml(doc);
            let result = await this.client.createNote(doc, html, guid);

            logger.info(`Create note success, ${result.guid}: ${result.title}`);

            this.client.guids[result.guid] = result;
            this.client.notes.push(result);
        } catch (e) {
            logger.error(`Error occurred, code: ${e.errorCode}, msg: ${e.parameter}`);
        }
    }

    async updateNote(doc) {
        logger.info(`Start to update note, ${doc.name}`);

        try {
            let html   = await this.getHtml(doc);
            let result = await this.client.updateNote(doc, html);

            logger.info(`Update note success, ${result.guid}: ${result.title}`);

            this.client.guids[result.guid] = result;
        } catch (e) {
            logger.error(`Error occurred, code: ${e.errorCode}, msg: ${e.parameter}`);
            logger.error(e)
        }
    }

    async getHtml(doc) {
        let content = await fs.readFile(`${doc.dirent.full_path}`, { encoding });

        return this.md.juice(content);
    }
}

module.exports = Sync;
