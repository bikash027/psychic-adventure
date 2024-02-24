const typeorm = require('typeorm');


const User = new typeorm.EntitySchema({
    name: 'User',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        name: {
            type: 'varchar',
            nullable: false,
        },
        interests: {
            type: 'simple-json',
            nullable: true
        },
        popularityScore: {
            type: 'int',
            nullable: true
        }
    },
    relations: {
        posts: {
            target: 'Post',
            type: 'one-to-many',
        },
    }
})

module.exports = User;