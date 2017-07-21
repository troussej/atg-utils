import { Utils } from '../utils/utils.service';
const config = require('../config.module')
import * as path from 'path';
import * as _ from "lodash";
import * as Q from 'q';
import * as fs from 'fs';
import * as mustache from 'mustache';
const screen = require('./screen.module');
import * as treeify from 'treeify';
import * as logger from 'winston';
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
                this.createAndOpenGraph();
            }
        )

    }



    private readManifest(moduleName: string): Q.Promise<ATGModule> {
        let manifestPath = path.join(config.get('dynamoRoot'), moduleName.replace(/\./g, path.sep), MANIFEST_SUB_PATH);
        logger.debug('manifest %s : ', manifestPath);
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
        logger.debug('temp %j', temp);

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

    private createAndOpenGraph(): void {

        logger.debug('create graph')

        let nodes: Q.Deferred<string> = Q.defer<string>();
        this.readModuleFile('../templates/nodes.data.mustache', (err, data) => {

            if (err) {
                nodes.reject(err);
            } else {
                nodes.resolve(data)
            }
        })

        let graph: Q.Deferred<string> = Q.defer<string>();
        this.readModuleFile('../templates/modules.graph.mustache', (err, data) => {
            if (err) {
                graph.reject(err);
            } else {
                graph.resolve(data)
            }
        })

        Q.all([
            graph.promise,
            nodes.promise
        ]).then((retVal) => {

            logger.silly('After reading files %j', retVal);

            let graphFile = retVal[0], nodeTemplate = retVal[1];
            let nodesData = this.buildGraphData();

            logger.debug('nodes data %j',nodesData)

            let renderedData = mustache.render(nodeTemplate, nodesData);

            logger.debug('renderedData %s', renderedData)

            const osTmpdir = require('os-tmpdir');
            let temp = osTmpdir();
            logger.debug('temp folder = %s', temp);
            let htmlFile = path.join(temp, 'atg.graph.html');
            let jsfile = path.join(temp, 'atg.graph.js');

            logger.debug('files %s %s ', htmlFile, jsfile);

            fs.writeFileSync(htmlFile, graphFile, { encoding: 'UTF-8' });
            fs.writeFileSync(jsfile, renderedData, { encoding: 'UTF-8' });

            let opn = require('opn');
            opn(htmlFile);

        },
        err =>{
            logger.error(err);
        })
    }

    //      {id: 1, label: 'Node 1' },
    // { id: 2, label: 'Node 2' },
    // { id: 3, label: 'Node 3' },
    // { id: 4, label: 'Node 4' },
    // { id: 5, label: 'Node 5' },
    // { id: 6, label: 'Node 6' },
    // { id: 7, label: 'Node 7' },
    // { id: 8, label: 'Node 8' }
    //   ]);

    // // create an array with edges
    // var edges = new vis.DataSet([
    //     { from: 1, to: 8, arrows: 'to', dashes: true },
    //     { from: 1, to: 3, arrows: 'to' },
    //     { from: 1, to: 2, arrows: 'to, from' },
    //     { from: 2, to: 4, arrows: 'to, middle' },
    //     { from: 2, to: 5, arrows: 'to, middle, from' },
    //     { from: 5, to: 6, arrows: { to: { scaleFactor: 2 } } },
    //     { from: 6, to: 7, arrows: { middle: { scaleFactor: 0.5 }, from: true } }

    private buildGraphData(): any {
        let res: any = {};
        res.nodes = [];
        res.edges = [];
        this.modules.forEach((mod:ATGModule)=>{
            res.nodes.push({ id: mod.name, label: mod.name })
            _.forEach(mod.dependencies, (dep: string) => {
                res.edges.push({ from: mod.name, to: dep, arrows: 'to' });
            })
        })
        _
        return {nodes:JSON.stringify(res.nodes),edges:JSON.stringify(res.edges)};
    }

    private  readModuleFile(path, callback) {
        logger.debug('readModuleFile %s', path)
        try {
            var filename = require.resolve(path);
            fs.readFile(filename, 'utf8', callback);
        } catch (e) {
            logger.debug('readModuleFile err : %j', e)
            callback(e);
        }
    }
}