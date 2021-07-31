const navbar = document.querySelector('nav');
const burger = document.querySelector('#hamburger');
const projects = Array.from(document.querySelectorAll('.projects'));
const header = document.querySelector('header');

/* ======= BURGER MENU ======= */
function burgerHandler() {
	burger.classList.toggle('opened');
	navbar.classList.toggle('show');
	document.body.classList.toggle('lock');
}

burger.addEventListener('click', burgerHandler);
/* =========================== */

/* == NAVBAR CLICK HANDLING == */
Array.from(navbar.querySelectorAll('li')).forEach((link) => link.addEventListener('click', burgerHandler));
/* =========================== */

/* ======= IMG LOADER ======= */
function fallbackImage(e) {
	function fullFallbackImage(e) {
		e.target.removeEventListener('error', fullFallbackImage);
		e.target.parentElement.parentElement.style.display = 'none';
	}

	e.target.removeEventListener('error', fallbackImage);
	e.target.addEventListener('error', fullFallbackImage);
	const i = Array.from(document.querySelectorAll('.projects_container')).indexOf(e.target.parentElement.parentElement.parentElement.parentElement.parentElement);
	e.target.src = `/img/project${i + 1}_base.svg`;
}
projects.forEach((projectContainer, i) => {
	Array.from(projectContainer.children).forEach((project, j) => {
		const imageContainer = project.querySelector('.project__img');
		const img = imageContainer.querySelector('img');
		img.addEventListener('error', fallbackImage);
		img.alt = img.parentElement.parentElement.children[1].children[0].textContent;
		img.src = `/img/project${i + 1}_${j + 1}.png`;
	});
});
/* ========================== */

/* ==== PROJECTS PREVIEW ==== */
projects.forEach((projectsContainer) =>
	Array.from(projectsContainer.children).forEach((project) => project.children[0].addEventListener('click', () => alert('Projektide lisateave pole veel lisatud!'))),
);
/* ========================== */

/* ==== PROJECTS ADDRESS ==== */
projects.forEach((projectsContainer) =>
	Array.from(projectsContainer.children).forEach((project) =>
		project.children[1].children[1].addEventListener('click', () => window.open(`https://maps.google.com/?q=${project.children[1].children[1].textContent}`)),
	),
);
/* ========================== */

/* = UURIMA button handling = */
header.querySelector('button').addEventListener('click', () => {
	window.location.hash = 'projects';
});
/* ========================== */
