const listLocalConfig = require('./commands/listLocalConfig.command');
const listlogs = require('./commands/logs.list.command');
const editLocalConfig = require('./commands/editLocalConfig.command');
const setLogs = require('./commands/logs.set.command');

module.exports={
    commands:[
        listLocalConfig,
        listlogs,
        editLocalConfig,
        setLogs

    ]
}