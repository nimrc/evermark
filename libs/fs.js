'use strict';

const fs                      = require('fs');
const { promisify }           = require('util');
const { root_path, encoding } = require('../config');

class Markfile {
    constructor(path, dirent) {
        this.path    = path;
        this.dirent  = dirent;
        let { name } = this.dirent;

        this.name = name.substr(0, name.lastIndexOf('.'));
    }
}

fs.readFile = promisify(fs.readFile);
fs.readdir  = promisify(fs.readdir);
fs.stat     = promisify(fs.stat);

fs.readfile = async (name) => {
    let full_path = name;
    let split     = name.split('/');

    name = split.pop();

    let dir = split.pop();
    if (dir === '') dir = 'InBox';

    if (name.substr(-2).toLowerCase() === 'md')
        return new Markfile(dir, { name, full_path });

    return null;
};

fs.scandir = async (dir) => {
    let files = await fs.readdir(dir, { withFileTypes: true });
    let mds   = [];

    for (let file of files) {
        if (file.name.indexOf('.') === 0)
            continue;

        if (file.name.substr(-2).toLowerCase() === 'md')
            mds.push(new Markfile(dir, file));

        if (file.isDirectory()) {
            let subdir = await fs.scandir(`${dir}/${file.name}`);
            mds.push(...subdir);
        }
    }

    return mds;
};

fs.getTheme = async (name) => {
    return fs.readFile(`${root_path}/themes/${name}.css`, { encoding });
};

module.exports = fs;

