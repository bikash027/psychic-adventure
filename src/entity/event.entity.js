const typeorm = require('typeorm');


const Event = new typeorm.EntitySchema({
    name: 'Event',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        event_name: {
            type: 'varchar',
            nullable: false,
        },
        sport_id: {
            type: 'int',
            nullable: false
        }
    },
    relations: {
        posts: {
            target: 'Post',
            type: 'one-to-many',
        },
        sport: {
            target: 'Sport',
            type: 'many-to-one',
            joinColumn: {name: 'sport_id'}
        }
    }
})

module.exports = Event;