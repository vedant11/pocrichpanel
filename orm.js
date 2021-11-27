const getPermAcc = async ({ uid, knexInst }) => {
	return knexInst('tokens').select('perm_access').where('uid', uid);
};
const setPermAcc = async ({ uid, knexInst, perm_access }) => {
	let res = await knexInst('tokens').select('perm_access').where({
		uid: uid,
	});
	if (!res.length) {
		console.log('adding new perm_access');
		res = await knexInst('tokens').insert({
			uid: uid,
			perm_access: perm_access,
		});
	} else {
		console.log('updating perm_access for ' + uid);
		res = await knexInst('tokens')
			.where({
				uid: uid,
			})
			.update({
				perm_access: perm_access,
			});
	}
	return res;
};
module.exports = { getPermAcc, setPermAcc };
