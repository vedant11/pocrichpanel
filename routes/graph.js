var express = require('express');
var graphRouter = new express.Router();
var { getPermAcc, serPermAcc } = require('../orm');
var knexInst = require('../knex');
var { getReq, postReq } = require('../https');

/* utils */

const subToPage = ({ access_token, id }) => {
	postReq({
		url: `https://graph.facebook.com/${id}/subscribed_apps?`,
		url_params: {
			subscribed_fields: 'feed',
			access_token: access_token,
		},
		callback: (data) => {
			console.log('did we subscribe?', data);
		},
	});
};

/* GET users listing. */
graphRouter.get('/pages/:uid', async function (req, res, next) {
	let posts = ['no posts attached to this userID'],
		perm_access,
		currData;
	try {
		perm_access = await getPermAcc({
			uid: req.params['uid'],
			knexInst: knexInst,
		});
		perm_access = perm_access[0]['perm_access'];
		getReq({
			url: 'https://graph.facebook.com/me/accounts?',
			url_params: {
				access_token: perm_access,
			},
			callback: (response) => {
				currData = response['data'];
				for (let ky in currData) {
					const access_token = currData[ky]['access_token'],
						name = currData[ky]['name'],
						id = currData[ky]['id'];
					subToPage({
						access_token: access_token,
						id: id,
					});
					posts[ky] = {
						access_token: access_token,
						name: name,
						id: id,
					};
				}
				res.json(posts);
			},
		});
	} catch (error) {
		console.log('matching query doesnt exist', error);
		return res.json(posts);
	}
});

module.exports = graphRouter;
