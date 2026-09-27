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

loadProjects();