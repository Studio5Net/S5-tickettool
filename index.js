const { ShardingManager } = require('discord.js');
const { token } = require('./config.json');
process.removeAllListeners('warning');
const manager = new ShardingManager('./bot.js', { token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();