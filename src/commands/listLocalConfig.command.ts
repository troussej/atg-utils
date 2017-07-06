import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

const config = require('../config.module')

class ListLocalConfig extends Command {


    command: string = 'list';
    desc: string = 'List localconfig';
    handle = () => {
        logger.info('Local config :')
        Utils.printList(Utils.listLocalConfig());
    };
    options = [

    ]

}

const c: Command = new ListLocalConfig();
module.exports = c;