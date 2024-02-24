const typeorm = require('typeorm');


const Post = new typeorm.EntitySchema({
    name: 'Post',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        text: {
            type: 'varchar',
            nullable: false,
        },
        sport_id: {
            type: 'int',
            nullable: false,
        },
        event_id: {
            type: 'int',
            nullable: false,
        },
        comments: {
            type: 'int',
            default: 0,
            nullable: false
        }, 
        likes: {
            type: 'int',
            default: 0,
            nullable: false
        },
        user_id: {
            type: 'int',
            nullable: false,
        }
    },
    relations: {
        event: {
            target: 'Event',
            type: 'many-to-one',
            joinColumn: 'event_id'
        },
        sport: {
            target: 'Sport',
            type: 'many-to-one',
            joinColumn: 'sport_id'
        },
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: 'user_id'
        }
    }
})

module.exports = Post;