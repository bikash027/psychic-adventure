const typeorm = require('typeorm');


const Sport = new typeorm.EntitySchema({
    name: 'Sport',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        sport_name: {
            type: 'varchar',
            nullable: false,
        }
    },
    relations: {
        posts: {
            target: 'Post',
            type: 'one-to-many',
        },
        events: {
            target: 'Event',
            type: 'one-to-many',
        },
    }
})

module.exports = Sport;