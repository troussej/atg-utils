import { Command, Option } from '../command.model';

import { Utils } from '../utils/utils.service';
const logger = require('../utils/screen.module');
import * as _ from "lodash";
const Q = require('q');
const config = require('../config.module')
require('console.table');

class ListLogs extends Command {
    name: string = 'logs';
    command: string = 'logs';
    description: string = 'list local logging override';
    scriptName: string = 'logs.list';
    action = () => { };
    handle = () => {
        let files = Utils.listLocalConfigFiles();
        let components = _.map(files, Utils.getNucleusPathFromFilePath);
        let compToFile = _.fromPairs(_.zip(components, files));


        Q.all(
            _.map(files, (file: string) => Utils.readConfigFile(file))
        )
            .then((properties: any[]) => {
                let allconfig: {} = {};
                for (var index = 0; index < properties.length; index++) {
                    let ppties: any = properties[index];
                    let comp: string = components[index];
                    allconfig[comp] = {
                        component: comp
                    }
                    //keep component name as first
                    _.assignIn(allconfig[comp], Utils.readLoggingConfig(ppties));
                }
                return allconfig;
            })
            .then(allconfig => {
                let table = _.chain(allconfig)
                    .values()
                    .sortBy('component')
                    .value();
                console.table(table);
            })

    }


}

const c: Command = new ListLogs();
module.exports = c;