import { Command } from '../command.model';
import { Config } from '../config.service';
import { Utils } from '../utils';

export class EditLocalConfig extends Command {
    name: string = 'config';
    desc: string = 'Edit localconfig';
    handler = () => {
        this.utils.openFile('~/.atgrc.json')
    }

}