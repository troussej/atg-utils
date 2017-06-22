import { Command } from './command.model';
import { Config } from './config.service';
import { Utils } from './utils';
import { EditLocalConfig } from './commands/editLocalConfig.command'
import * as _ from "lodash";



export class Launcher {

    public static start() {
        let config;
        try {
            config = new Config();
        } catch (e) {
            return;
        }

        let utils = new Utils(config);

        let commands: Command[] = [
            new EditLocalConfig(config,utils)
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