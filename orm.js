const getPermAcc = async ({ uid, knexInst }) => {
	return knexInst('tokens').select('perm_access').where('uid', uid);
};
// util
const setVal = async (
	knexInst,
	table_name,
	matching_field,
	field_val,
	toUpdate
) => {
	console.log(...Object.keys(toUpdate));
	let res = await knexInst(table_name)
		.select(...Object.keys(toUpdate))
		.where(matching_field, field_val);
	if (!res.length) {
		console.log(
			'adding new entry for ' + `${matching_field}: ` + field_val
		);
		toUpdate[matching_field] = field_val;
		res = await knexInst(table_name).insert(toUpdate);
	} else {
		console.log('updating fields for ' + `${matching_field}: ` + field_val);
		res = await knexInst(table_name)
			.where(matching_field, field_val)
			.update(toUpdate);
	}
	return res;
};
const setPermAcc = async ({ uid, knexInst, perm_access }) => {
	return setVal(knexInst, 'tokens', 'uid', uid, { perm_access: perm_access });
};
const populatePageDetails = (knexInst, page_id, access_token) => {
	return setVal(knexInst, 'pages', 'page_id', page_id, {
		access_token: access_token,
	});
};
const persistPages = async (knexInst, detailsArr) => {
	// block transaction SQL will be efficient
	for (key in detailsArr) {
		let details = detailsArr[key];
		let res = await knexInst('manager').select('*').where(details);
		if (!res.length) {
			await knexInst('manager').insert(details);
		}
	}
};
const persistPosts = async (knexInst, detailsArr, page_id) => {
	// block transaction SQL will be efficient
	for (key in detailsArr) {
		let details = detailsArr[key];
		let res = await knexInst('posts').select('*').where({
			page_id: page_id,
			post_id: details['id'],
		});
		if (!res.length) {
			await knexInst('posts').insert({
				page_id: page_id,
				post_id: details['id'],
			});
		}
	}
};

const persistComments = async (knexInst, detailsArr, post_id) => {
	// block transaction SQL will be efficient
	for (key in detailsArr) {
		let details = detailsArr[key];
		let res = await knexInst('comments').select('*').where({
			post_id: post_id,
			comment_id: details['id'],
			uid: details['from']['id'],
		});
		if (!res.length) {
			await knexInst('comments').insert({
				post_id: post_id,
				comment_id: details['id'],
				uid: details['from']['id'],
			});
		}
	}
};

module.exports = {
	getPermAcc,
	setPermAcc,
	populatePageDetails,
	persistPages,
	persistPosts,
	persistComments,
};
