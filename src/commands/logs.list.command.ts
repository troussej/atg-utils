import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

const config = require('../config.module')

export class ListLogs extends Command {


    name: string = 'list';
    desc: string = 'list all local logging override';
    handler: () => {

    }


}