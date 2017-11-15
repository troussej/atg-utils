const listLocalConfig = require('./commands/listLocalConfig.command');
const listlogs = require('./commands/logs.list.command');
const editLocalConfig = require('./commands/editLocalConfig.command');
const setLogs = require('./commands/logs.set.command');
const graph = require('./commands/graph.command');
const pipeline = require('./commands/pipeline.command');

module.exports={
    commands:[
        listLocalConfig,
        listlogs,
        editLocalConfig,
        setLogs,
        graph,
        pipeline

    ]
}