async function loadProjects() {
    const response = await fetch('projects.json');
    const projects = await response.json();

    const container = document.querySelector('.projects-container');

    projects.forEach(project => {
        const card = document.createElement('a');
        card.classList.add('project-card');
        card.href = project.link;
        card.target = "_blank";

        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        `;

        container.appendChild(card);
    });
}
const form = document.querySelector('.contact-form');

form.addEventListener('submit', async function(e){
    e.preventDefault();

    const data = new FormData(form);

    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
    });

    if(response.ok){
        form.innerHTML = '<p style="font-size:1.8rem;">Thanks! Your message has been sent.</p>';
    } else {
        alert('Oops! Something went wrong. Please try again.');
    }
});

loadProjects();