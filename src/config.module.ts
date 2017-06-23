const readConfig = require('read-config');
const os = require('os');
const path = require('path');
const fs = require('fs');

class Config {

    private config: any;
    private configPath: string;
    private loaded: boolean = false;
    constructor() {

        this.configPath = path.join(os.homedir(), '.atgrc.json');

        let exists: boolean = fs.existsSync(this.configPath);

        if (exists) {
            try {
                this.config = readConfig(this.configPath);
                this.loaded = true;
            } catch (e) {
                this.loaded = false;
            }
        } else {
            this.loaded = false;
        }


        if (!this.loaded) {
            console.error('Cannot read config file %s', this.configPath);
        }

    }

    public get(key: string): any {
        return this.config[key];
    }

    public isLoaded(): boolean {
        return this.loaded;
    }
}

const conf: Config = new Config();
module.exports = conf;