
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import * as ini from 'ini';
import * as _ from "lodash";
const screenlog = require('./utils/screen.module');
const readline = require('readline');
import * as Q from 'q';

class Config {

    private config: any;
    private configPath: string;
    private loaded: boolean = false;
    constructor() {

        this.configPath = this.getConfigPath();
        let exists: boolean = fs.existsSync(this.configPath);
        if (exists) {
            try {
                let content: string = fs.readFileSync(this.configPath, 'UTF-8');

                this.config = ini.parse(content);


                this.loaded = true;

                // this.config = readConfig(this.configPath);
                // this.loaded = true;
            } catch (e) {
                this.loaded = false;
            }
        } else {
            this.loaded = false;
        }
        if (!this.loaded) {
            this.config = {};
        }
     //   this.checkConfigRequirement();



    }

    private getConfigPath(): string {
        return path.join(os.homedir(), '.atgconfig');

    }

    private checkRequirements(): Q.Promise<void> {

        var args = ["dynamoHome", "editor"];

        var result :Q.Promise<void>= Q();
        let self = this;
        args.forEach(function(t) {
            result = result.then(
                ()=>self.checkConfig(t)
                )
        });
        return result;
        
        
    }

    public checkConfig(path: string):Q.Promise<void> {

        let deferred: Q.Deferred<void> = Q.defer<void>();

        if (_.isEmpty(this.get(path))) {
            screenlog.error('%s is not configured', path);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Please set value for ' + path+ '\n', (answer) => {
                // TODO: Log the answer in a database
                this.config[path] = ini.safe(answer);

                rl.close();
                this.save();
                deferred.resolve();
            });
        }else{
            deferred.resolve();
        }

        return deferred.promise;
    }

    public save() {
        fs.writeFileSync(this.configPath, ini.stringify(this.config));
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