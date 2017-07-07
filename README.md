atg-utils
===

Command line utilities for ATG


# Installation

`npm install -g atg-utils`

Create a .atgconfig file in your user's home with the following content:

(if you don't create the file, you will be asked each param on first startup)

```bash
editor=<editor>
dynamoHome=<dynamo home>
```

Ex:

```bash
editor=subl
dynamoHome=/somewhere/foo/bar/ATG/ATG11.2/home
```


Your user's home folder should be something like:

 - unix : `/home/<user>`
 - windows : `C:\\users\\<user>`
 - osx : `/Users/<user>`


# Usage

`atg <command>`

## Commands

- `atg list`

Lists the components that have a .properties in your `$DYNAMO_HOME/localconfig`

- `atg logs`

List the log levels that are overriden in your localconfig

Ex:

```sh
> atg logs
component                                                                                        loggingDebug  loggingInfo
-----------------------------------------------------------------------------------------------  ------------  ----------                                                                                                              
/atg/commerce/PipelineManager                                                                    false         true       
/atg/commerce/custsvc/returns/ReturnFormHandler                                                  true                     
/atg/commerce/custsvc/returns/ReturnManager                                                      false                    
/atg/commerce/custsvc/returns/ReturnTools                                                        true           
```

- `atg edit <nucleus-path>`

Opens your editor to edit a .properties in your localconfig

Ex:

`atg edit /some/test/Component`