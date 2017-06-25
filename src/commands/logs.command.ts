import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
import { ListLogs } from './logs.list.command';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

const config = require('../config.module')

export class Logs extends Command {


    name: string = 'log';
    desc: string = 'Manipulate local logging';


    constructor() {
        super();
        this.subCommands = [
            new ListLogs()
        ]
    }
}