var {
	getPermAcc,
	populatePageDetails,
	persistPages,
	persistPosts,
	persistComments,
} = require('../orm');
var knexInst = require('../knex');
var { getReq, postReq } = require('../https');

/* utils */

const subToPage = async ({ access_token, id }) => {
	await postReq({
		url: `https://graph.facebook.com/${id}/subscribed_apps?`,
		url_params: {
			subscribed_fields: 'feed',
			access_token: access_token,
		},
		callback: (data) => {
			console.log('did we subscribe?', data);
		},
	});
	// persist access_token, id for the page against uid
	await populatePageDetails(knexInst, id, access_token);
	// need to get already existing posts /:pageid/feed?access_token=
	await getReq({
		url: `https://graph.facebook.com/${id}/feed?`,
		url_params: {
			access_token: access_token,
		},
		callback: async (response) => {
			persistPosts(knexInst, response['data'], id);
			console.log('posts persisted successfully');
			for (key in response['data']) {
				let post_id = response['data'][key]['id'];
				await getReq({
					url: `https://graph.facebook.com/${post_id}/comments?`,
					url_params: {
						access_token: access_token,
					},
					callback: (response) => {
						persistComments(knexInst, response['data'], post_id);
						console.log('comments persisted successfully');
					},
				});
			}
		},
	});
};

const subAllPages = async (uid) => {
	let posts = [],
		perm_access,
		currData;
	try {
		perm_access = await getPermAcc({
			uid: uid,
			knexInst: knexInst,
		});
		perm_access = perm_access[0]['perm_access'];
		getReq({
			url: 'https://graph.facebook.com/me/accounts?',
			url_params: {
				access_token: perm_access,
			},
			callback: async (response) => {
				currData = response['data'];
				for (let ky in currData) {
					const access_token = currData[ky]['access_token'],
						name = currData[ky]['name'],
						id = currData[ky]['id'];
					await subToPage({
						access_token: access_token,
						id: id,
					});
					posts[ky] = {
						uid: uid,
						page_id: id,
					};
				}
				await persistPages(posts);
			},
		});
		return 0;
	} catch (error) {
		console.log('matching query doesnt exist', error);
		return 1;
	}
};

module.exports = { subAllPages };
