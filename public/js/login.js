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
			const { secret } = res.data;
			window.location.href = `/${login}/${secret}`;
		})
		.catch((err) => {
			const error = {
				err: { message: err.message, stack: err.stack },
				res: {
					status: {
						code: err.response.status,
						text: err.response.statusText,
					},
					data: err.response.data,
				},
				req: JSON.parse(err.config.data),
			};

			console.log(error);

			if (error.res?.data?.error === 'wrong_login') alert('Wrong Username');
			else if (error.res?.data?.error === 'wrong_password') alert('Wrong Password');
			else alert(`Unknown error occured! Please contact server admin and provide next message:\n${JSON.stringify(error)}`);
		});
});
