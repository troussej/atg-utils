import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

class EditLocalConfig extends Command {

    name: string = 'edit';
    arguments: string = '<component>';
    command: string = 'edit <component>';
    description: string = 'edit local configuration';
    scriptName: string = 'editLocalConfig';

    handle = () => { };
    action = (npath: string) => {
        console.log('npath %s', npath);
        if (_.isEmpty(npath)) {
            logger.error('Missing argument path');
        } else {

            // logger.out(cleanpath)
            let filePath = Utils.getPropertiesFromNucleusPath(npath);
            // logger.out(filePath)
            Utils.createFolderFromFilePath(filePath).then(
                () => {
                    Utils.openFile(filePath)
                }
            )

        }
    };
    options = [

    ]

}

const c: Command = new EditLocalConfig();
module.exports = c;