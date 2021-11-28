const createTableIfDoesntExist = async (table_name, ...rows) => {
	let exists = false;

	exists = await knexInst.schema.hasTable(table_name);
	try {
		if (!exists) {
			console.log(`making ${table_name}`);
			await knexInst.schema.createTable(table_name, (table) => {
				for (key in rows) {
					let row = rows[key];
					table.string(row);
				}
			});
		}
	} catch {
		(err) => console.log('db init error', err);
	}
};

module.exports = async function init(knexInst) {
	createTableIfDoesntExist('tokens', 'uid', 'perm_access');
	createTableIfDoesntExist('manager', 'uid', 'page_id');
	createTableIfDoesntExist('pages', 'page_id', 'access_token');
	createTableIfDoesntExist('posts', 'page_id', 'post_id');
	createTableIfDoesntExist('comments', 'post_id', 'comment_id', 'uid');
};
