const { CronJob } = require('cron');
const {initDB} = require('./db.js');
const { calculatePopularity } = require('./utils.js');

const job = new CronJob(
	'0 */15 * * * *', // cronTime
	async function () {
        try{
            console.log('scheduled job start')
            await initDB();
            await calculatePopularity();
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