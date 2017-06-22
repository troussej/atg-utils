import { Config } from './config.service';
import { Utils } from './utils';
export abstract class Command {
    name: String;
    desc: String;
    handler: Function;

    constructor(protected config: Config,protected utils:Utils) {

    }
}