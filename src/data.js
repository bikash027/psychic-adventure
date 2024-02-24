const {Command} = require('commander');
const {dataSource, initDB} = require('./db.js');
const { addData, displayData } = require('./utils.js');

const program = new Command();

program.command('add')
    .description('add some rows in the specified table')
    .argument('<number>', 'number of rows to add')
    .requiredOption('--table <string>', 'table in which rows are to be inserted')
    .action(async (num, options) => {
        await initDB();
        num = parseInt(num);
        await addData({
            dataSource,
            table: options.table,
            num
        })
        // await dataSource.destroy();
    })

program.command('display')
    .description('display the data in the specified table in paginated format')
    .argument('<string>', 'table to display (should be one of "users", "sports", "events" and "posts")')
    .option('--page <number>', 'page of table', 1)
    .option('--limit <number>', 'number of rows per page', 10)
    .action(async (table, options) => {
        await initDB();
        await displayData({
            dataSource,
            table,
            ...options
        })
        // await dataSource.destroy();
    })

program.parse();

