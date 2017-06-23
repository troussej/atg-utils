const config = require('../config.module')
const path = require('path');

export class Utils {

    public static getPropertiesFromNucleusPath(componentPath:string):string{
        return path.join(config.get('atgHome'),'localconfig',path+'.properties');
    }

    public  static openFile( file:string):void{
        var exec = require('child_process').exec;
        var cmd = `${config.get('editor')} ${file}`;

        exec(cmd, function(error:any, stdout:any, stderr:any) {
            // command output is in stdout
        });
    }

}