const config = require('../config.module')
const path = require('path');
import * as _ from "lodash";
const shell = require('shelljs');
const logger = require('./screen.module');

export class Utils {

    public static getPropertiesFromNucleusPath(componentPath: string): string {
        let cleanpath = Utils.cleanPath(componentPath);
        return path.join(config.get('dynamoHome'), 'localconfig', cleanpath + '.properties');
    }

    public static openFile(file: string): void {
        var exec = require('child_process').exec;
        var cmd = `${config.get('editor')} ${file}`;

        exec(cmd, function (error: any, stdout: any, stderr: any) {
            // command output is in stdout
        });
    }
    public static cleanPath(npath: string): string {
        if (_.isEmpty(npath)) {
            return '';
        } else {
            let res: string = npath.trim();
            res = res.replace('.properties', '');
            res = path.normalize(res)
            if (res.endsWith(path.sep)) {
                res = res.substr(0, res.length - 1);

            }
            return res;
        }
    }

    public static listLocalConfig(): string[] {
        let dynHome = config.get('dynamoHome');
        let files = shell.find(dynHome).filter((val: string) => val.match(/\.properties$/));
        let components = _.map(files, (path: string) => path.replace(/.*localconfig/, '').replace('.properties', '')).sort();
        return components;
    }

    public static printList(list: string[]): void {
        _.each(list, (elem: string) => {
            logger.out(elem);
        })
    }

}