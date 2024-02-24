const {Command} = require('commander');
const { faker } = require('@faker-js/faker')
const {dataSource, initDB} = require('./db.js');
const User = require('./entity/user.entity.js')
const Sport = require('./entity/sport.entity.js')
const Event = require('./entity/event.entity.js')
const Post = require('./entity/post.entity.js')

const program = new Command();

program.command('add')
    .description('add some rows in the specified table')
    .argument('<number>', 'number of rows to add')
    .requiredOption('--table <string>', 'table in which rows are to be inserted')
    .action(async (num, options) => {
        await initDB();
        num = parseInt(num);
        if(options.table == 'users'){
            if(num > 10){
                num = 10;
            }
            const existingUsers = await dataSource.getRepository(User).find();
            const usersData = [];
            const initNum = num;
            while(num--){
                const name = faker.person.fullName();
                // To make sure unique users are added:
                if(
                    existingUsers.find((user) => user.name == name) ||
                    usersData.find((user) => user.name == name)
                ){
                    num++;
                    continue;
                }
                usersData.push({name})
            }
            await dataSource.getRepository(User).insert(usersData)
            console.log(`${initNum} users added.`)
        } else if(options.table == 'sports'){
            if(num > 10){
                num = 10;
            }
            const existingSports = await dataSource.getRepository(Sport).find();
            const sportsData = [];
            const initNum = num;
            while(num--){
                const sport_name = faker.string.alpha({ length: { min: 5, max: 10 }, casing: 'lower' });
                // To make sure unique sports are added:
                if(
                    existingSports.find((sport) => sport.sport_name == sport_name) ||
                    sportsData.find((sport) => sport.sport_name == sport_name)
                ){
                    num++;
                    continue;
                }
                sportsData.push({sport_name})
            }
            await dataSource.getRepository(Sport).insert(sportsData)
            console.log(`${initNum} sports added.`)
        } else if(options.table == 'events'){
            if(num > 10){
                num = 10;
            }
            const existingEvents = await dataSource.getRepository(Event).find();
            const eventsData = [];
            const sports = await dataSource.getRepository(Sport).find();
            const initNum = num;
            while(num--){
                const city = faker.location.city();
                const country = faker.location.country();
                const event_name = faker.helpers.arrayElement([city, country]) + ' ' + 
                    faker.helpers.arrayElement(['league', 'cup', 'trophy', 'series', 'tournament']);
                const sport_id = faker.helpers.arrayElement(sports.map(sport => sport.id));
                // To make sure unique events are added:
                if(
                    existingEvents.find((event) => event.event_name == event_name && event.sport_id == sport_id) ||
                    eventsData.find((event) => event.event_name == event_name && event.sport_id == sport_id)
                ){
                    num++;
                    continue;
                }
                eventsData.push({event_name, sport_id})
            }
            await dataSource.getRepository(Event).insert(eventsData)
            console.log(`${initNum} events added.`)
        } else if(options.table == 'posts'){
            if(num > 1000){
                num = 1000;
            }
            const postsData = [];
            const events = await dataSource.getRepository(Event).find();
            const users = await dataSource.getRepository(User).find();
            const initNum = num;
            while(num--){
                const text = faker.lorem.sentence({ min: 3, max: 5 });
                const event = faker.helpers.arrayElement(events);
                const comments = faker.number.int({ max: users.length });
                const likes = faker.number.int({ max: users.length });
                const user_id = faker.helpers.arrayElement(users.map(user => user.id));
                postsData.push({
                    text,
                    sport_id: event.sport_id,
                    event_id: event.id,
                    comments,
                    likes,
                    user_id
                })
            }
            await dataSource.getRepository(Post).insert(postsData)
            console.log(`${initNum} posts added.`)
        } else {
            throw new Error('--table should be one of "users", "sports", "events" and "posts"');
        }
    })

program.command('view')
    .description('display the data in the specified table in paginated format')
    .argument('<string>', 'table to display (should be one of "users", "sports", "events" and "posts")')
    .option('--page <number>', 'page of table', 1)
    .option('--limit <number>', 'number of rows per page', 10)
    .action(async (table, options) => {
        await initDB();
        let {page, limit} = options;
        page = page? parseInt(page): 1;
        limit = limit? parseInt(limit): 10;
        let Entity;
        if(table == 'users'){
            Entity = User;
        } else if(table == 'sports'){
            Entity = Sport;
        } else if(table == 'events'){
            Entity = Event;
        } else if(table == 'posts'){
            Entity = Post;
        } else {
            throw new Error('argument should be one of "users", "sports", "events" and "posts"')
        }
        const [items, itemCount] = await dataSource.getRepository(Entity)
            .findAndCount({
                skip: (page - 1)*limit,
                take: limit,
            });
        const meta = {
            page,
            limit,
            pageCount: itemCount/limit,
            totalItems: itemCount
        };
        console.log('Metadata:');
        console.log(meta);
        console.log(table,':');
        console.log(items);
    })

program.parse();

