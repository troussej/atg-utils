const listLocalConfig = require('./commands/listLocalConfig.command');
const listlogs = require('./commands/logs.list.command');

module.exports={
    commands:[
        listLocalConfig,
        listlogs,

    ]
}