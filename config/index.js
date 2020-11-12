'use strict';

const evernote      = require('./evernote');
const logger        = require('./logger');
const { root_path } = logger;

module.exports = {
    root_path,
    evernote,
    logger,
    encoding: 'utf8',
    docs    : '/Users/work/Documents/笔记/'
};

