const request = require("supertest");
const {app, server, job} = require("../src/server.js");
const {dataSource, initDB} = require('../src/db.js');
const { addData, displayData, calculatePopularity } = require('../src/utils.js');
const User = require("../src/entity/user.entity.js");


beforeAll(async () => {
    await initDB();
    await addData({
        dataSource,
        table: 'users',
        num: 10
    })
    await addData({
        dataSource,
        table: 'sports',
        num: 10
    })
    await addData({
        dataSource,
        table: 'events',
        num: 10
    })
    await addData({
        dataSource,
        table: 'posts',
        num: 50
    })
    await calculatePopularity();
})

afterAll(async () => {
    await dataSource.query('DROP table post');
    await dataSource.query('DROP table event');
    await dataSource.query('DROP table sport');
    await dataSource.query('DROP table user');
    await dataSource.destroy();
    job.stop();
    server.close();
})


describe('Recommendation API', () => {
    it('should work', async () => {
        const [firstUser] = await dataSource.getRepository(User).find({
            take: 1
        });
        const res = await request(app)
            .get('/api/recommendations/users/' + firstUser.id)
        expect(res.statusCode).toEqual(200)
    })
})