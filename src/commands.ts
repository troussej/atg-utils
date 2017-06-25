import { Command, Option } from './command.model';

import { EditLocalConfig } from './commands/editLocalConfig.command'
import { ListLocalConfig } from './commands/listLocalConfig.command'
import { Logs } from './commands/logs.command'
const config: Config = require('./config.module');
import * as _ from "lodash";



export class Commands {

    private initCommand(sc: any, cmdDef: Command) {

        let cmdInst = sc.command(cmdDef.name, {
            desc: cmdDef.desc,
            callback: cmdDef.handler
        });
        _.forEach(cmdDef.options, (opt: Option) => {
            cmdInst.option(
                opt.name, {
                    abbr: opt.abbr,
                    desc: opt.desc,
                    valueName: opt.valueName,
                    flag: opt.flag,
                    default: opt.default
                }
            )

        });
        if (cmdDef.subCommands && cmdDef.subCommands.length > 0) {
            _.forEach(cmdDef.subCommands, (subCommand: Command) => {
                console.log('sub cmd %j', subCommand)
                this.initCommand(cmdInst, subCommand);
            })
        }

    }

    public start() {

        if (!config.isLoaded()) {
            return -1;
        };


        let commands: Command[] = [
            new EditLocalConfig(),
            new ListLocalConfig(),
            new Logs()
        ];

        var sc = require('subcommander');
        _.forEach(commands, (cmd: Command) => {
            this.initCommand(sc, cmd);
        })


        sc.scriptName('atg');
        sc.parse();

    }
}