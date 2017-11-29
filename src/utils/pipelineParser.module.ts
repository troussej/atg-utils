import { Utils } from '../utils/utils.service';
const config = require('../config.module')
import * as path from 'path';
import * as _ from "lodash";
import * as Q from 'q';
import * as fs from 'mz/fs';
import * as mustache from 'mustache';
import * as xml2js from 'xml2js';
import * as logger from 'winston';
logger.level = 'debug';// process.env.LOG_LEVEL


const MANIFEST_SUB_PATH = 'META-INF/MANIFEST.MF';
const ATG_REQ = 'ATG-Required';


class PipelineChain {
    public name: String;
    public headlink: PipelineLink;
    public links: {};
    constructor(data: any) {
        this.name = data.$.name;
        this.links = _(data.pipelinelink)
            .map((link: any) => {
                let oLink = new PipelineLink(link);
                return [oLink.name, oLink]
            })
            .fromPairs()
            .value();
        this.headlink = this.links[data.$.headlink];

    }

    public toPUml(): string {
        let nodes = _(this.links).map((link: PipelineLink) => {
            return `object ${link.name} {
       processor : ${link.processor}     
    }`
        })
            .value();
        let transitions = _(this.links)
            .flatMap((link: PipelineLink) => _.toPairs(link.transitions).map(pair => [link.name, pair]))
            .map(elem => `${elem[0]} "${elem[1][0]}" --> ${elem[1][1]}`)
            .value();

        let res = `package "${this.name}" {

    ${nodes.join('\n    ')}

    ${transitions.join('\n    ')}

}`;

        return res;

    }
}

class PipelineLink {
    public name: String;
    public processor: String;
    public transitions: Map<String, String>;
    constructor(link) {
        logger.log('%j', link);
        this.name = link.$.name;
        logger.log('name %s', this.name)
        this.processor = (_.first(link.processor) as any).$.jndi;
        logger.log('processor %s', this.processor)
        this.transitions = _(link.transition)
            .map(tr => { return [tr.$.returnvalue, tr.$.link] })
            .fromPairs()
            .value();

        logger.log('transitions %j', this.transitions)
    }

}

export class PipelineParser {


    constructor() {

    }

    public parse(file: string, splitFolder: string): void {

        this.readFile(file)
            .then(this.buildModel)

            .then(data => this.handleOutput(data, splitFolder))
            .catch(console.error)
            ;


    }



    private readFile(file: string): Q.Promise<any> {
        let def: Q.Deferred<any> = Q.defer<any>();

        fs.readFile(file, (err, data) => {
            if (err) {
                def.reject(err);
            } else {
                var parser = new xml2js.Parser();
                parser.parseString(data, function(err, result) {
                    if (err) {
                        def.reject(err);
                    } else {
                        def.resolve(result);
                    }

                });
            }
        });

        return def.promise;
    }

    private buildModel(data: any): Q.Promise<PipelineChain[]> {
        let def: Q.Deferred<PipelineChain[]> = Q.defer<PipelineChain[]>();
        let pipes = _.map(data.pipelinemanager.pipelinechain, (data) => new PipelineChain(data));

        def.resolve(pipes)
        return def.promise;

    }

    private handleOutput(chains: PipelineChain[], splitFolder: string): Promise<PipelineChain[]> {


        if (_.isNil(splitFolder)) {
            let data = _(chains).map(chain => chain.toPUml()).value();
            console.log('@startuml');
            console.log(data.join('\n'));
            console.log('@enduml');
            return Promise.resolve(chains);
        } else {

            return fs.exists(splitFolder)
                .then(exists => {
                    if (exists) {
                        return Promise.resolve(true);
                    } else {
                        return fs.mkdir(splitFolder).then(() => true)

                    }
                })
                .then(() => {
                    let writeProm = _.map(chains, (chain) => {
                        let file = path.join(splitFolder, chain.name + '.puml');
                        console.log('writing to %s', file)
                        fs.writeFile(file, chain.toPUml());
                    })

                    return Promise.all(writeProm);
                })
                .then(() => Promise.resolve(chains))

        }

    }



}