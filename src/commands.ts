import { Command } from './command.model';

import { EditLocalConfig } from './commands/editLocalConfig.command'
const config:Config = require('./config.module');
import * as _ from "lodash";



export class Launcher {



    public static start() {

        if(!config.isLoaded()){
            return -1;
        };


        let commands: Command[] = [
            new EditLocalConfig()
        ];

        var sc = require('subcommander');

        _.forEach(commands, (cmd: Command) => {
            sc.command(cmd.name, {
                desc: cmd.desc,
                callback: cmd.handler
            });
        });

        sc.scriptName('atg');
        sc.parse();

    }
}