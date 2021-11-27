var knex = require('knex');
var init = require('./init_db');
module.exports = knexInst = knex({
	client: 'sqlite3',
	connection: {
		filename: 'graph.sqlite3',
	},
	useNullAsDefault: true,
});
init(knexInst);
