const { CronJob } = require('cron');
const {dataSource, initDB} = require('./db.js');
const User = require('./entity/user.entity.js')
const Post = require('./entity/post.entity.js');

const job = new CronJob(
	'0 */15 * * * *', // cronTime
	async function () {
        try{
            console.log('scheduled job start')
            await initDB();
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
        } catch(e){
            console.log("Error in scheduled job", e.message);
        } finally{
            console.log('scheduled job end');
        }
	}, // onTick
	null, // onComplete
	true, // start
	'Asia/Kolkata' // timeZone
);


module.exports = job;