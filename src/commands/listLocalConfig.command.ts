import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

const config = require('../config.module')

export class ListLocalConfig extends Command {


    command: string = 'list';
    desc: string = 'List localconfig';
    handler = () => {
        logger.info('Local config :')
        Utils.printList(Utils.listLocalConfig());
    };
    options = [

    ]

}