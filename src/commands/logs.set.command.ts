import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
const logger = require('../utils/screen.module');
import * as _ from "lodash";
const Q = require('q');
const config = require('../config.module')


class SetLogLevel extends Command {
    name: string = 'log';
    command: string = 'log <level> <value> <path>';
    description: string = 'override local config log level';
    scriptName: string = 'logs.set';
    action = (level: string, invalue: string, path: string) => {

        if(_.isEmpty(path)){
            logger.error('empty component')
            return;
        }

        let filePath = Utils.getPropertiesFromNucleusPath(path);
        let levelName = 'logging' + _.capitalize(_.lowerCase(level));
        let value = invalue === 'true';


        Utils.createFolderFromFilePath(filePath)
            .then(() => Utils.setLogLevel(levelName, value, filePath))
            .then(() => console.log('set %s=%s in %s', levelName, value, filePath))
    };
    handle = () => {

    }


}

const c: Command = new SetLogLevel();
module.exports = c;