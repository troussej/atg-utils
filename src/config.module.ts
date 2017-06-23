const readConfig = require('read-config');
const os = require('os');
const path = require('path');

class Config {

    private config: any;
    constructor() {

        let configPath = path.join(os.homedir(), '.atgrc.json')

        try {
            this.config = readConfig(configPath);
        } catch (e) {
            console.error('cannot read ' + configPath + ' config', e);
            throw "configError";
        }
    }

    public get(key: string): any {
        return this.config[key];
    }
}

const conf: Config = new Config();
module.exports= conf;