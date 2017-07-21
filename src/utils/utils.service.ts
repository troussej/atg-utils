const config = require('../config.module')
import * as path from 'path';
import * as _ from "lodash";
import * as shell from 'shelljs';
const screen = require('./screen.module');
import * as properties from 'properties';
import * as mkdirp from 'mkdirp';
import * as Q from 'q';
import * as fs from 'fs';

import * as logger from 'winston';
logger.level = process.env.LOG_LEVEL

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

    public static createFolderFromFilePath(file: string): Q.Promise<void> {

        let dir = path.dirname(file);

        var deferred: Q.Deferred<void> = Q.defer<void>();

        mkdirp(dir, function(err) {
            if (err) { deferred.reject(err) }
            else {
                deferred.resolve();
            }
        });

        return deferred.promise;
    }

    public static openFile(file: string): void {
        var exec = require('child_process').exec;
        var cmd = `${config.get('editor')} ${file}`;

        exec(cmd, function() {
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
        let files = shell.find(path.join(dynHome, 'localconfig')).filter((val: string) => val.match(/\.properties$/));
        return files;
    }

    public static listLocalConfig(): string[] {
        let files = Utils.listLocalConfigFiles();
        let components = _.map(files, Utils.getNucleusPathFromFilePath).sort();
        return components;
    }

    public static printList(list: string[]): void {
        _.each(list, (elem: string) => {
            screen.out(elem);
        })
    }

    public static readConfigFile(filepath: string): Q.Promise<any> {
        var deferred: Q.Deferred<any> = Q.defer<any>();
        properties.parse(filepath, { path: true }, function(error: any, obj: any) {
            if (error) {
                deferred.reject(error);
            }
            else {
                deferred.resolve(obj);

            };
        });
        return deferred.promise;
    }

    public static setLogLevel(level: string, value: boolean, filePath: string): Q.Promise<any> {

        return Utils.readConfigFile(filePath)
            .fail(err => {
                if (err.code === 'ENOENT') {
                    return {}
                } else {
                    throw err;
                }
            })
            .then(config => {
                config[level] = value;
                return config;
            })
            .then((config) => {
                let def: Q.Deferred<string> = Q.defer<string>();
                properties.stringify(config, { path: filePath, unicode: true }, (error: any, stringValue: string) => {
                    if (error) {
                        console.error('setLogLevel %j', error);
                        def.reject(error);
                    } else {
                        def.resolve(stringValue);
                    }

                })
                return def.promise;
            })
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