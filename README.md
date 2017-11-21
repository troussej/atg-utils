atg-utils
===

Command line utilities for ATG

# Overview

This command line utility allows simple access to your local config folder, and perform operations on the .properties:
 - list all the .properties 
 - list all the logging overides
 - open the localconfig properties by simply entering a Nucleus path
 - edit quickly the log levels
 - generate puml from a pipeline xml

# Installation

`npm install -g atg-utils`

Create a .atgconfig file in your user's home with the following content:

 - editor : editor of choice (vi,subl,emacs, etc)
 - dynamoHome : $DYNAMO_ROOT/home

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

`> atg <command>`

## Commands

### atg list

`> atg list`

Lists the components that have a .properties in your `$DYNAMO_HOME/localconfig`

Ex:

```sh
>  atg list
Local config :
/atg/commerce/PipelineManager
/atg/commerce/custsvc/returns/ReturnFormHandler
/atg/commerce/custsvc/returns/ReturnManager
/atg/commerce/custsvc/returns/ReturnTools
```

### atg logs

`> atg logs`

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

### atg log

 `atg log <level> <value> <nucleus-path>`

Edits the logging level in your localconfig. Creates the files/folder if necessary 

- level: trace, debug, info, error
- value: true/false
- path : /a/nucleus/Componennt

Ex:

```sh
> atg log debug true /some/Component
set loggingDebug=true in /foobar/ATG/ATG11.2/home/localconfig/some/Component.properties
```

### atg edit

`> atg edit <nucleus-path>`

- path : /a/nucleus/Componennt

Opens your editor to edit a .properties in your localconfig. Creates the files/folder if necessary

Ex:

`atg edit /some/test/Component`

### atg graph <module>

`> atg graph <module>`

 - module: the name of a module in $DYNAMO_ROOT . This can be a sub module, like `Project.server.BCC`

 Creates a graph of all the dependencies and opens it in the default browser. (the file is created in the temp folder according to the os);

### atg pipeline <file>

 `> atg graph <module>`

 Generates a [puml](http://plantuml.com/) diagram source from a pipeline definition file.