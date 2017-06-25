import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

export class EditLocalConfig extends Command {
    name: string = 'edit';
    desc: string = 'Edit localconfig';
    handler = (params: any) => {
        let npath = params.path;
        if (_.isEmpty(npath)) {
            logger.error('Missing argument --path');
        } else {

            // logger.out(cleanpath)
            let filePath = Utils.getPropertiesFromNucleusPath(npath);
            // logger.out(filePath)
            Utils.openFile(filePath)
        }
    };
    options = [
        new Option(
            'path',
            'p',
            'Nucleus path of the component'

        )
    ]

}