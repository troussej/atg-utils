import { Command, Option } from './command.model';

import { EditLocalConfig } from './commands/editLocalConfig.command'
import { ListLocalConfig } from './commands/listLocalConfig.command'
import { Logs } from './commands/logs.command'
const config: Config = require('./config.module');
import * as _ from "lodash";



export class Commands {

    private initCommand(program: any, cmdDef: Command) {


        program.command(cmdDef.command, cmdDef.desc);


        // _.forEach(cmdDef.options, (opt: Option) => {
        //     program.option(
        //         opt.name, {
        //             abbr: opt.abbr,
        //             desc: opt.desc,
        //             valueName: opt.valueName,
        //             flag: opt.flag,
        //             default: opt.default
        //         }
        //     )

        // });
       // program.action(cmdDef.handler);
        

    }

    public start() {

        if (!config.isLoaded()) {
            return -1;
        };


        let commands: Command[] = [
            new EditLocalConfig(),
            new ListLocalConfig()
           // new Logs()
        ];


        const program = require('commander');


        _.forEach(commands, (cmd: Command) => {
            this.initCommand(program, cmd);
        })

        program.parse(process.argv);




    }
}