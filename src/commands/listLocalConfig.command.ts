import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

const config = require('../config.module')

class ListLocalConfig extends Command {

    name: string = 'list';
    command: string = 'list';
    description: string = 'list local configuration';
    scriptName: string = 'listLocalConfig';

    handle = () => {
        logger.info('Local config :')
        Utils.printList(Utils.listLocalConfig());
    };
    options = [

    ]

}

const c: Command = new ListLocalConfig();
module.exports = c;