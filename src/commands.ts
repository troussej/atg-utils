import { Command, Option } from './command.model';

import { EditLocalConfig } from './commands/editLocalConfig.command'
import { ListLocalConfig } from './commands/listLocalConfig.command'
const config: Config = require('./config.module');
import * as _ from "lodash";



export class Launcher {

    public static start() {

        if (!config.isLoaded()) {
            return -1;
        };


        let commands: Command[] = [
            new EditLocalConfig(),
            new ListLocalConfig()
        ];

        var sc = require('subcommander');

        _.forEach(commands, (cmd: Command) => {
            sc.command(cmd.name, {
                desc: cmd.desc,
                callback: cmd.handler
            });
            _.forEach(cmd.options, (opt: Option) => {
                sc.option(
                    opt.name, {
                        abbr: opt.abbr,
                        desc: opt.desc,
                        valueName: opt.valueName,
                        flag: opt.flag,
                        default: opt.default
                    }
                )
            })
        });

        sc.scriptName('atg');
        sc.parse();

    }
}