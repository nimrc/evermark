'use strict';
const path      = require('path');
const root_path = path.normalize(path.join(__dirname, '../'));
const log_path  = path.join(root_path, 'logs');

module.exports = {
    root_path,
    log_path,
    pattern             : '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    layout              : {
        type   : 'pattern',
        pattern: `[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%[%p%]] %c - %m`
    }
};
