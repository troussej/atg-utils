import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
import { ModuleParser } from '../utils/atgModuleParser.module';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

class ModuleGraph extends Command {

    name: string = 'graph';
    arguments: string = '<module>';
    command: string = 'graph <module>';
    description: string = 'parse the graph of module dependencies';
    scriptName: string = 'graph';

    handle = () => { };
    action = (modulepath: string) => {
        console.log('npath %s', modulepath);
        if (_.isEmpty(modulepath)) {
            logger.error('Missing argument module');
        } else {

            let mp = new ModuleParser();
            mp.parseProject(modulepath);

        }
    };
    options = [

    ]

}

const c: Command = new ModuleGraph();
module.exports = c;