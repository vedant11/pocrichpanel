const storeAccessKey = () => {
	FB.getLoginStatus((res) => {
		let user_access_token = res['authResponse']['accessToken'],
			uid = res['authResponse']['userID'];
		localStorage.setItem('uat', user_access_token);
		localStorage.setItem('uid', uid);
		fetch(`/set_token/${user_access_token}/${uid}`);
	});
};
