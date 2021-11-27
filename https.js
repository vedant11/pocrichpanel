var axios = require('axios').default;

const getReq = async ({ url, url_params, callback }) => {
	axios
		.get(url + new URLSearchParams(url_params))
		.then((res) => {
			return res.data;
		})
		.then((data) => {
			callback(data);
		})
		.catch((err) => console.error(err));
	// non zero code
	return 0;
};

const postReq = async ({ url, url_params, callback }) => {
	axios.post(url + new URLSearchParams(url_params)).then((useless) => {
		callback(useless.data);
	});
	// non zero code
	return 0;
};
module.exports = { getReq, postReq };
