const config = require('../config.module')
const path = require('path');
import * as _ from "lodash";
export class Utils {

    public static getPropertiesFromNucleusPath(componentPath: string): string {
        return path.join(config.get('dynamoHome'), 'localconfig', componentPath + '.properties');
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

}