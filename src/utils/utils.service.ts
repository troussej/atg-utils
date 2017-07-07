const config = require('../config.module')
import * as path from 'path';
import * as _ from "lodash";
import * as shell from 'shelljs';
import * as logger from './screen.module';
import * as properties from 'properties';
import * as mkdirp from 'mkdirp';
import * as Q from 'q';

/**
 Actually does most of the work...
*/
export class Utils {

    public static getPropertiesFromNucleusPath(componentPath: string): string {
        let cleanpath = Utils.cleanPath(componentPath);
        return path.join(config.get('dynamoHome'), 'localconfig', cleanpath + '.properties');
    }

    public static getNucleusPathFromFilePath(filePath: string): string {
        return filePath.replace(/.*localconfig/, '').replace('.properties', '');
    }

    public static createFolderFromFilePath(file: string): Promise<boolean> {

        let dir = path.dirname(file);

        var deferred = Q.defer();

        mkdirp(dir, function(err) {
            if (err) {deferred.reject(err)}
            else {
                deferred.resolve(true);
            }
        });
      
        return deferred.promise;
    }

    public static openFile(file: string): void {
        var exec = require('child_process').exec;
        var cmd = `${config.get('editor')} ${file}`;

        exec(cmd, function () {
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

    public static listLocalConfigFiles(): string[] {
        let dynHome = config.get('dynamoHome');
        let files = shell.find(path.join(dynHome,'localconfig')).filter((val: string) => val.match(/\.properties$/));
        return files;
    }

    public static listLocalConfig(): string[] {
        let files = Utils.listLocalConfigFiles();
        let components = _.map(files, Utils.getNucleusPathFromFilePath).sort();
        return components;
    }

    public static printList(list: string[]): void {
        _.each(list, (elem: string) => {
            logger.out(elem);
        })
    }

    public static readConfigFile(filepath: string): Promise<any> {
        var deferred = Q.defer();
        properties.parse(filepath, { path: true }, function (error: any, obj: any) {
            if (error) {
                logger.error(error);
                deferred.reject(new Error(error));
            }
            else {
                deferred.resolve(obj);

            };
        });
        return deferred.promise;
    }

    public static readLoggingConfig(properties: any): any {

        let config: any = {};
        if (!_.isNil(properties.loggingTrace)) {
            config.loggingTrace = properties.loggingTrace;
        }
        if (!_.isNil(properties.loggingDebug)) {
            config.loggingDebug = properties.loggingDebug;
        }
        if (!_.isNil(properties.loggingInfo)) {
            config.loggingInfo = properties.loggingInfo;
        }
        if (!_.isNil(properties.loggingError)) {
            config.loggingError = properties.loggingError;
        }
        return config;
    }
}