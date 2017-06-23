
export abstract class Command {
    name: String;
    desc: String;
    handler: Function;
    option: Option[];
   
}

export class Option{
    abbr: string;
    desc: string;
    valueName: string;
    flag: boolean;
    default: any;
}