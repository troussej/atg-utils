import { Config } from './config.service';
export class Utils {


    constructor(private config:Config){
    }


    public  openFile( file:string){
        var exec = require('child_process').exec;
        var cmd = `${this.config.get('editor')} ${file}`;

        exec(cmd, function(error:any, stdout:any, stderr:any) {
            // command output is in stdout
        });
    }

}