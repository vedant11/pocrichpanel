var express = require('express');
var https = require('https');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/set_token/:token', (req, res) => {
	const token = req.params['token'];
	const setPermToken = () => {
		const url = 'https://graph.facebook.com/oauth/access_token?';
		try {
			https.get(
				url +
					new URLSearchParams({
						grant_type: 'fb_exchange_token',
						client_id: 484533942877641,
						client_secret: '505c8544aff8550b028feb57ff52ee43',
						fb_exchange_token: token,
					}),
				(res) => {
					let stream = '',
						data;
					res.on('data', (chunk) => {
						stream += chunk;
					});
					res.on('end', () => {
						data = JSON.parse(stream);

						console.log(
							'need to persist this token in DB ',
							data['access_token']
						);
					});
				}
			);
		} catch (error) {
			console.log('error', error);
		}
	};

	setPermToken();
});

module.exports = router;
