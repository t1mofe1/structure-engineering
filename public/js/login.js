const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const login = form.children[1].value.trim();
	const password = form.children[2].value.trim();

	await axios
		.post('/login', {
			login,
			password,
		})
		.then((res) => {
			let { secret, error } = res.data;
			if (error) {
				if (error === 'wrong_login') alert('Wrong Username');
				else if (error === 'wrong_password') alert('Wrong Password');
				else alert(`Unknown error! Please contact server admin! Code: ${error}`);
			} else {
				window.location.href = `/${login}/${secret}`;
			}
		})
		.catch((err) => {
			alert(`Unknown error occured! Please contact server admin and provide next message:\n${err.message}`);
			console.log(err);
		});
});
