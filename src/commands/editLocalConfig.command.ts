import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
const logger = require('../utils/screen.module');
import * as _ from "lodash";

export class EditLocalConfig extends Command {
    name: string = 'config';
    desc: string = 'Edit localconfig';
    handler = (params: any) => {
        let npath = params.path;
        if (_.isEmpty(npath)) {
            logger.error('Missing argument --path');
        } else {
            let cleanpath = Utils.cleanPath(npath);
            // logger.out(cleanpath)
            let filePath = Utils.getPropertiesFromNucleusPath(cleanpath);
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