import { Utils } from '../utils/utils.service';
const config = require('../config.module')
import * as path from 'path';
import * as _ from "lodash";
import * as Q from 'q';
const screen = require('./screen.module');
import * as logger from 'winston';
import * as treeify from 'treeify';
logger.level = process.env.LOG_LEVEL

export class ATGModule {

    constructor(public name: string, public dependencies: string[]) {

    }
}

const MANIFEST_SUB_PATH = 'META-INF/MANIFEST.MF';
const ATG_REQ = 'ATG-Required';

export class ModuleParser {


    private modules: Map<string, ATGModule>;
    private nodesToVisit: string[];
    private i: number = 0;
    constructor() {

    }

    public parseProject(rootName: string) {
        // logger.debug('parseModule %s',path)
        this.modules = new Map<string, ATGModule>();
        this.nodesToVisit = [];


        this.nodesToVisit.push(rootName);
        this.visitNextBatch().then(
            () => {
                logger.debug(this.modules)
                this.printTree(this.modules.get(rootName))
            }
        )

    }

    // private parseModule(moduleName: string): Q.Promise<void> {
    //     logger.debug('readManifest %s', moduleName)

    //     var result: Q.Promise<void> = Q();

    //     if (!this.modules.has(moduleName)) {

    //         let manifestPath = path.join(config.get('dynamoRoot'), moduleName.replace('.', path.sep), MANIFEST_SUB_PATH);
    //         //  logger.debug('manifest %s : ', manifestPath);
    //         return Utils.readConfigFile(manifestPath)
    //             .then(data => {
    //                 let dependencies: string[] = data[ATG_REQ].split(' ');
    //                 this.modules.set(moduleName, new ATGModule(moduleName, dependencies));

    //                 logger.debug(JSON.stringify(data, null, 4));
    //                 logger.debug('dependencies %j', dependencies);


    //                 let self = this;
    //                 dependencies.forEach(function(t) {
    //                     result = result.then(
    //                         () => self.readManifest(t),//success
    //                         () => self.readManifest(t),//error : continue
    //                     )
    //                 });


    //             })
    //     } else {
    //         result.thenResolve('false');
    //     }
    //     return result;


    // }

    private readManifest(moduleName: string): Q.Promise<ATGModule> {
        let manifestPath = path.join(config.get('dynamoRoot'), moduleName.replace('.', path.sep), MANIFEST_SUB_PATH);
        //  logger.debug('manifest %s : ', manifestPath);
        return Utils.readConfigFile(manifestPath)
            .then(data => {
                let dependencies: string[] = data[ATG_REQ].split(' ');
                let mod = new ATGModule(moduleName, dependencies);
                logger.debug(JSON.stringify(mod, null, 4));
                return mod;
            })
    }

    private mapSeries(arr, iterator) {
        // create a empty promise to start our series (so we can use `then`)
        var currentPromise = Q()
        var promises = arr.map(function(el) {
            return currentPromise = currentPromise.then(function() {
                // execute the next function after the previous has resolved successfully
                return iterator(el)
            })
        })
        // group the results and return the group promise
        return Q.all(promises)
    }



    private visitNextBatch() {
        logger.debug('visit batch %s', this.i++);

        if (this.nodesToVisit.length > 0) {


            var copyOfNodes: string[] = _.cloneDeep(this.nodesToVisit);
            this.nodesToVisit = [];

            return this.mapSeries(copyOfNodes, (mod: string) => {
                logger.debug('handle %s', mod)
                if (!this.modules.has(mod)) {
                    return this.readManifest(mod)
                        .then((atgMod: ATGModule) => {
                            this.modules.set(atgMod.name, atgMod);
                            this.nodesToVisit = _.concat(this.nodesToVisit, atgMod.dependencies);
                        }, () => {
                            this.modules.set(mod, new ATGModule(mod, null))

                        })
                } else {
                    return Q();
                }
            }).then(
                () => this.visitNextBatch()
                )

        } else {
            return Q();
        }


    }

    private printTree(mod: ATGModule): void {

        let temp = this.buildPrintTree(mod);
        logger.debug('temp ', temp);

        screen.info(mod.name);
        treeify.asLines(temp, true, (line) => {
            screen.info(line);
        });

    }

    private buildPrintTree(mod: ATGModule) {
        let res = {};
        logger.silly('buildPrintTree mod %j', mod);
        if (mod) {
            _.forEach(mod.dependencies, (dep: string) => {
                logger.silly('buildPrintTree dep %s', dep);
                res[dep] = this.buildPrintTree(this.modules.get(dep));
            })


        }
        logger.silly('buildPrintTree res %j', res);
        return res;

    }
}