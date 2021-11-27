module.exports = async function init(knexInst) {
	let exists = false;
	exists = await knexInst.schema.hasTable('tokens');
	try {
		if (!exists) {
			console.log('making tokens table');
			await knexInst.schema.createTable('tokens', (table) => {
				table.string('uid');
				table.string('perm_access');
			});
		}
	} catch {}
};
