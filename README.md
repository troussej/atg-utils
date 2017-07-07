atg-utils
===

Command line utilities for ATG


# Installation

`npm install -g atg-utils`

Create a .atgrc.json file in your user's home with the following content:

```js
{
    "editor":"<your favorite editor, ex vi, subl>",
    "dynamoHome":"<path to dynamo home>"
}

```

Ex:

```js
{
    "editor":"subl",
    "dynamoHome":"/some/path/ATG11.1/home"
}

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