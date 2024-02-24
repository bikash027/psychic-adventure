const express = require('express')
const bodyParser = require('body-parser')
const {dataSource, initDB} = require('./db.js');
const User = require('./entity/user.entity.js');
const { addData, displayData } = require('./utils.js');
const job = require('./cronjob.js');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(async (req, res, next) => {
    await initDB();
    next();
})

app.get('/api/recommendations/users/:userId', async (req, res, next) => {
    try{
        const allUsers = await dataSource.getRepository(User).find({
            order: {
                popularityScore: 'DESC'
            }
        });
        const matchedUser = allUsers.find(user => user.id == req.params.userId);
        if(!matchedUser){
            throw new Error('User not found');
        }
        const recommendedUsers = allUsers.filter(user => {
            if(user.id === matchedUser.id) return false;
            if(user.interests === null) return false;
            if(matchedUser.interests.find(el1 => user.interests.find(el2 => el1 === el2))){
                return true;
            }
        })
        res.json(recommendedUsers)
    } catch(e){
        next(e);
    }
})

app.post('/api/add', async (req, res, next) => {
    try{
        const {table, itemCount} = req.body;
        const resContent = await addData({
            dataSource,
            table,
            num: itemCount
        })
        res.send(resContent);
    } catch(e){
        next(e);
    }
})

app.get('/api/display', async (req, res, next) => {
    try{
        const {table, page, limit} = req.query;
        const resContent = await displayData({
            dataSource,
            table,
            page,
            limit
        })
        res.json(resContent);
    } catch(e){
        next(e);
    }
})

// app.use(async () => {
//     if(!job.running)
//         await dataSource.destroy();
// })

app.listen(process.env.SERVERPORT?? 3000)