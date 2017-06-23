import { Command } from '../command.model';

import { Utils } from '../utils.service';

export class EditLocalConfig extends Command {
    name: string = 'config';
    desc: string = 'Edit localconfig';
    handler = () => {
        Utils.openFile('~/.atgrc.json')
    }

}