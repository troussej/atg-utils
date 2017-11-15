

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

    handle = () => { };
    action = (filepath: string) => {
        //console.log('npath %s', modulepath);
        if (_.isEmpty(filepath)) {
            logger.error('Missing argument filepath');
        } else {

            let mp = new PipelineParser();
            mp.parse(filepath);

        }
    };
    options = [

    ]

}

const c: Command = new Pipeline();
module.exports = c;