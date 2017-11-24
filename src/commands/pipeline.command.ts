

import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
import { PipelineParser } from '../utils/pipelineParser.module';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

class Pipeline extends Command {

    name: string = 'pipeline';
    arguments: string = '<file>';
    command: string = 'pipeline <file>';
    description: string = 'parse a pipeline definition';
    scriptName: string = 'pipeline';
    options: any[] = [
        {
            argument: '-s, --split <folder>',
            description: 'Split into one file per chain, and write them to <folder>'
        }
    ];


    handle = () => { };
    action = (filepath: string,options:any) => {
        if (_.isEmpty(filepath)) {
            logger.error('Missing argument filepath');
        } else {

            let mp = new PipelineParser();
            mp.parse(filepath, options.split);

        }
    };

}

const c: Command = new Pipeline();
module.exports = c;