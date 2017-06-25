const chalk = require('chalk');


class MyScreen {

    public out(msg: string, params: any[]) {
        if (params) {
            console.log(msg, params);

        } else {
            console.log(msg);
        }
    }


    public error(msg: string, params: any[]) {

        this.out(chalk.red(msg), params)

    }
}

const s: MyScreen = new MyScreen();
module.exports = s;
