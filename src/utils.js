const User = require('./entity/user.entity.js')
const Sport = require('./entity/sport.entity.js')
const Event = require('./entity/event.entity.js')
const Post = require('./entity/post.entity.js')
const { faker } = require('@faker-js/faker')
const {dataSource} = require('./db.js');

const addData = async ({table, num}) => {
    if(table == 'users'){
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
        const message = `${initNum} users added.`
        console.log(message);
        return message;
    } else if(table == 'sports'){
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
        const message = `${initNum} sports added.`
        console.log(message);
        return message;
    } else if(table == 'events'){
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
        const message = `${initNum} events added.`
        console.log(message);
        return message;
    } else if(table == 'posts'){
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
        const message = `${initNum} posts added.`
        console.log(message);
        return message;
    } else {
        throw new Error('table should be one of "users", "sports", "events" and "posts"');
    }
}

const displayData = async ({table, page, limit}) => {
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
    console.log({meta, items})
    return {meta, items};
}

const calculatePopularity = async () => {
    const analyticsData = await dataSource.getRepository(Post)
        .createQueryBuilder('post')
        .leftJoin('post.user', 'user')
        .select('user.id', 'userId')
        .addSelect('GROUP_CONCAT(DISTINCT post.sport_id)', 'interests')
        .addSelect('SUM(post.comments)', 'comments')
        .addSelect('SUM(post.likes)', 'likes')
        .groupBy('user.id')
        .getRawMany();
    const allUsers = await dataSource.getRepository(User).find();
    allUsers.forEach(user => {
        const singleUserData = analyticsData.find(el => el.userId == user.id);
        if(!singleUserData) return;
        let {interests, comments, likes} = singleUserData;
        user.interests = interests? interests.split(',').map(el => parseInt(el)): null;
        comments = comments? parseInt(comments): 0;
        likes = likes? parseInt(likes): 0;
        user.popularityScore = comments + likes;
    })
    await dataSource.getRepository(User).save(allUsers);
}

module.exports = {addData, displayData, calculatePopularity}