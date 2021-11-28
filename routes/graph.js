var express = require('express');
var graphRouter = express.Router();

const dict = {};

graphRouter.get('/api/wh', (req, res) => {
	if (Object.prototype.hasOwnProperty.call(req.query, 'hub.verify_token'))
		res.send(req.query['hub.challenge']);
});
graphRouter.post('/api/wh', (req, res) => {
	console.log(req.body['entry']['changes']);
	let arr = req.body['entry']['changes'];
	for (key in arr) {
		let change = arr[key]['value'];
		if (change['item'] == 'post' && change['verb'] == 'add') {
			console.log('must add new post to the page in db');
		}
	}
	res.status(200).send();
});
module.exports = graphRouter;
