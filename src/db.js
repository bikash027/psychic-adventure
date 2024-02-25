const typeorm = require('typeorm');
const root = require('./paths.js');
const User = require('./entity/user.entity.js');
const Sport = require('./entity/sport.entity.js');
const Event = require('./entity/event.entity.js');
const Post = require('./entity/post.entity.js');

const dataSource = new typeorm.DataSource({
    type: process.env.NODE_ENV == 'production'?'mysql': 'sqlite',
    host: process.env.NODE_ENV == 'production'? process.env.MYSQLHOST: null,
    port: process.env.NODE_ENV == 'production'? process.env.MYSQLPORT: null,
    database: process.env.NODE_ENV == 'production'? process.env.MYSQLDATABASE: `${root}/data/${process.env.NODE_ENV??'test'}.sqlite`,
    username: process.env.NODE_ENV == 'production'? process.env.MYSQLUSER: null,
    password: process.env.NODE_ENV == 'production'? process.env.MYSQLPASSWORD: null,
    entities: [ User, Sport, Event, Post],
    synchronize: process.env.NODE_ENV == 'production'? false: true,
    // logging: true
})

async function initDB(){
    try{
        if(!dataSource.isInitialized){
            await dataSource.initialize()
            console.log('Database initialized')
        }
    } catch(e) {
        console.error("Error during Data Source initialization", e)
        return
    }
}

// initDB();

module.exports = {dataSource, initDB};