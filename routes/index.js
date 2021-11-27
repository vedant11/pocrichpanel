var express = require('express');
var { getReq } = require('../https');
var router = express.Router();
var { setPermAcc } = require('../orm');
var knexInst = require('../knex');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Richpanel' });
});

router.get('/set_token/:token/:uid', (req, res) => {
	const token = req.params['token'],
		uid = req.params['uid'];
	const setPermToken = () => {
		const url = 'https://graph.facebook.com/oauth/access_token?';
		try {
			getReq({
				url: url,
				url_params: {
					grant_type: 'fb_exchange_token',
					client_id: 484533942877641,
					client_secret: '505c8544aff8550b028feb57ff52ee43',
					fb_exchange_token: token,
				},
				callback: (data) => {
					const perm_access = data['access_token'];
					setPermAcc({
						uid: uid,
						perm_access: perm_access,
						knexInst: knexInst,
					});
				},
			});
		} catch (error) {
			console.log('error', error);
		}
	};

	setPermToken();
});

module.exports = router;
