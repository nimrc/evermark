'use strict';

const log4js     = require('log4js');
const path       = require('path');
const { logger } = require('../config');

const { log_path, layout, pattern, alwaysIncludePattern } = logger;

log4js.configure({
    appenders        : {
        out         : {
            type: 'console',
            layout
        },
        default     : {
            type    : 'dateFile',
            filename: path.join(log_path, 'application.log'),
            pattern,
            alwaysIncludePattern,
            layout
        },
        record_error: {
            type    : 'dateFile',
            filename: path.join(log_path, 'application-wf.log'),
            pattern,
            alwaysIncludePattern,
            layout
        },
        error       : {
            type    : 'logLevelFilter',
            appender: 'record_error',
            level   : 'error'
        },
        access      : {
            type    : 'dateFile',
            filename: path.join(log_path, 'access.log'),
            pattern,
            alwaysIncludePattern,
            layout
        }
    },
    categories       : {
        default: { appenders: ['out', 'default', 'error'], level: 'all' },
        access : { appenders: ['out', 'access'], level: 'all' }
    },
    pm2              : true,
    pm2InstanceVar   : 'INSTANCE_ID',
    disableClustering: true
});

/**
 * @var {Logger} logger
 * */
module.exports = log4js.getLogger();
