import { Command } from './command.model';

import { EditLocalConfig } from './commands/editLocalConfig.command'
import * as _ from "lodash";



export class Launcher {

    public static start() {


       
        let commands: Command[] = [
            new EditLocalConfig( )
        ];

        var sc = require('subcommander');

        _.forEach(commands, (cmd: Command) => {
            sc.command(cmd.name, {
                desc: cmd.desc,
                callback: cmd.handler
            });
        }),

            sc.scriptName('atg');
        sc.parse();

    }
}