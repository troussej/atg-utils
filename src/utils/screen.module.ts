const chalk = require('chalk');


class MyScreen{

    public out(msg: string, params: any[]) {
        console.log(msg, params);
    }


    public error(msg:string,params:any[]){
        console.log(chalk.red(msg), params);
    }
}

const s: MyScreen = new MyScreen();
module.exports = s;
