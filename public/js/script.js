const navbar = document.querySelector('nav');
const burger = document.querySelector('#hamburger');
const projects = Array.from(document.querySelectorAll('.projects'));

/* ======= BURGER MENU ======= */
burger.addEventListener('click', () => {
	burger.classList.toggle('opened');
	navbar.classList.toggle('show');
});
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
// projects.forEach((projectsContainer) => {
// 	Array.from(projectsContainer.children).forEach((project) => {});
// });
/* ========================== */