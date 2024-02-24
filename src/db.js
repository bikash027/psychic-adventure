const typeorm = require('typeorm');
const root = require('./paths.js');
const User = require('./entity/user.entity.js');
const Sport = require('./entity/sport.entity.js');
const Event = require('./entity/event.entity.js');
const Post = require('./entity/post.entity.js');

const dataSource = new typeorm.DataSource({
    type: "sqlite",
    database: `${root}/data/dev.sqlite`,
    entities: [ User, Sport, Event, Post],
    synchronize: true,
    // logging: true
})

async function initDB(){
    try{
        await dataSource.initialize()
        console.log('Database initialized')
    } catch(e) {
        console.error("Error during Data Source initialization", e)
        return
    }
}

// initDB();

module.exports = {dataSource, initDB};