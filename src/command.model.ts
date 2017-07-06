import * as _ from "lodash";
const path = require('path');

export abstract class Command {
    command: String;
    desc: String;
    handler: Function;
    options: Option[];
    subCommands: Command[];
    arguments:string= '';
    abstract handle: Function;
    abstract action: Function;

}

export class Option {
    name: string;
   
    abbr: string;
    desc: string;
    valueName: string;
    flag: boolean;
    default: any;

    constructor(name: string, abbr?: string, desc?: string, valueName?: string, flag?: boolean, def?: any) {
        this.name = name;
        if (abbr) {
            this.abbr = abbr;
        }
        if (desc) {
            this.desc = desc;
        }
        if (valueName) {
            this.valueName = valueName;
        }
        if (flag) {
            this.flag = flag;
        }
        if (def) {
            this.default = def;
        }

    }


}