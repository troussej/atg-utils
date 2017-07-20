import { Utils } from '../utils/utils.service';
const config = require('../config.module')
import * as path from 'path';
import * as _ from "lodash";
import * as Q from 'q';

export class ATGModule {

    constructor(public name: string, public dependencies: string[]) {

    }
}

const MANIFEST_SUB_PATH = 'META-INF/MANIFEST.MF';
const ATG_REQ = 'ATG-Required';

export class ModuleParser {


    private modules: Map<string, ATGModule>;
    private nodesToVisit: string[];
    private i: number = 0;
    constructor() {

    }

    public parseProject(rootName: string) {
        // console.log('parseModule %s',path)
        this.modules = new Map<string, ATGModule>();
        this.nodesToVisit = [];

      
        this.nodesToVisit.push(rootName);
        this.visitNextBatch().then(
            ()=>console.log('done',this.modules))
         
    }

    // private parseModule(moduleName: string): Q.Promise<void> {
    //     console.log('readManifest %s', moduleName)

    //     var result: Q.Promise<void> = Q();

    //     if (!this.modules.has(moduleName)) {

    //         let manifestPath = path.join(config.get('dynamoRoot'), moduleName.replace('.', path.sep), MANIFEST_SUB_PATH);
    //         //  console.log('manifest %s : ', manifestPath);
    //         return Utils.readConfigFile(manifestPath)
    //             .then(data => {
    //                 let dependencies: string[] = data[ATG_REQ].split(' ');
    //                 this.modules.set(moduleName, new ATGModule(moduleName, dependencies));

    //                 console.log(JSON.stringify(data, null, 4));
    //                 console.log('dependencies %j', dependencies);


    //                 let self = this;
    //                 dependencies.forEach(function(t) {
    //                     result = result.then(
    //                         () => self.readManifest(t),//success
    //                         () => self.readManifest(t),//error : continue
    //                     )
    //                 });


    //             })
    //     } else {
    //         result.thenResolve('false');
    //     }
    //     return result;


    // }

    private readManifest(moduleName: string): Q.Promise<ATGModule> {
        let manifestPath = path.join(config.get('dynamoRoot'), moduleName.replace('.', path.sep), MANIFEST_SUB_PATH);
        //  console.log('manifest %s : ', manifestPath);
        return Utils.readConfigFile(manifestPath)
            .then(data => {
                let dependencies: string[] = data[ATG_REQ].split(' ');
                let mod =  new ATGModule(moduleName, dependencies);
                console.log(JSON.stringify(mod, null, 4));
                return mod;
            })
    }

    private mapSeries(arr, iterator) {
        // create a empty promise to start our series (so we can use `then`)
        var currentPromise = Q()
        var promises = arr.map(function(el) {
            return currentPromise = currentPromise.then(function() {
                // execute the next function after the previous has resolved successfully
                return iterator(el)
            })
        })
        // group the results and return the group promise
        return Q.all(promises)
    }



    private visitNextBatch() {
        console.log('visit batch %s', this.i++);

        if(this.nodesToVisit.length>0){

       
            var copyOfNodes: string[] = _.cloneDeep(this.nodesToVisit);
            this.nodesToVisit = [];

           return this.mapSeries(copyOfNodes, (mod: string) => {
                console.log('handle %s',mod)
                if (!this.modules.has(mod)) {
                    return this.readManifest(mod)
                        .then((atgMod: ATGModule) => {
                            this.modules.set(atgMod.name, atgMod);
                            _.extend(this.nodesToVisit, atgMod.dependencies);
                        },()=>{
                            this.modules.set(mod, new ATGModule(mod,null))
                           
                        })
                }else{
                    return Q();
                }
            }).then(
                () => this.visitNextBatch()
            )

        } else {
            return Q();
        }

        
    }

}