import { Utils } from '../utils/utils.service';
const config = require('../config.module')
import * as path from 'path';
import * as _ from "lodash";
import * as Q from 'q';
import * as fs from 'fs';
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
        let nodes = _(this.links).map( ( link:PipelineLink) => {
            return link.name
        }).map(name=>`object ${name}`)
        .value();
        let transitions = _(this.links)
            .flatMap((link: PipelineLink) => _.toPairs(link.transitions).map(pair => [link.name,pair]))
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

    // public toPUml(chain: PipelineChain): string {
    //     let res = [`:${this.name};`];
    //     let tSize = this.transitions.size;
    //     if (tSize > 1) {
    //         let fork = []
    //         _.forEach(this.transitions, (val, nextName) => {
    //             fork.push(chain.links[nextName].toPUml(chain));
    //         })
    //         let forkText = `${fork.join('\n')}`;
    //         res.push(forkText);
    //     } else if (tSize === 1) {
    //         res.push((_(chain.links).toPairs().first()[1] as PipelineLink).toPUml(chain));
    //     } else {
    //         res.push('stop;')
    //     }


    //     return res.join('\n');
    // }

}

export class PipelineParser {


    constructor() {

    }

    public parse(file: string): void {

        this.readFile(file)
            .then(this.buildModel)
            .then(chains => _.map(chains, chain => chain.toPUml()))
            .then(data => {
                console.log('@startuml');
                console.log(data.join('\n'));
                console.log('@enduml');
            })
            .catch(console.error)
            ;


    }

    private readFile(file: string): Q.Promise<any> {
        let def: Q.Deferred<any> = Q.defer<any>();

        fs.readFile(file, function(err, data) {
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



}