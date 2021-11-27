const storeAccessKey = () => {
	FB.getLoginStatus((res) => {
		let user_access_token = res['authResponse']['accessToken'];
		localStorage.setItem('uat', user_access_token);
		fetch(`/set_token/${user_access_token}`);
	});
};
