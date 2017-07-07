import * as chalk from 'chalk';


class Colorizer {

    colors: {};

    context: string[] = [];


    constructor(){
        this.colors = {
            'error': chalk.red.bind(this)
        };
    }

}