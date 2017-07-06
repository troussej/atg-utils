import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

class EditLocalConfig extends Command {
    command: string = 'edit <component>';
    desc: string = 'Edit <nucleus path>';
    handle = (npath: string) => {
        if (_.isEmpty(npath)) {
            logger.error('Missing argument path');
        } else {

            // logger.out(cleanpath)
            let filePath = Utils.getPropertiesFromNucleusPath(npath);
            // logger.out(filePath)
            Utils.openFile(filePath)
        }
    };
    options = [
       
    ]

}

const c: Command = new EditLocalConfig();
module.exports = c;