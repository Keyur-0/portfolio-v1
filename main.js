async function loadProjects() {
    const response = await fetch('projects.json');

    const projects = await response.json();

    const container = document.querySelector('.projects-container');

    projects.forEach(project => {
        const card = document.createElement('div');
        card.classList.add('project-card');
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>

            <div class="project-buttons">
                ${project.download ? `
                    <a href="${project.download}"
                       class="project-btn"
                       download>
                        <i class="fa-solid fa-download"></i>
                        Download APK
                    </a>

                ` : ''}
                ${project.github ? `
                    <a href="${project.github}"
                       class="project-btn"
                       target="_blank"
                       rel="noopener noreferrer">
                        <i class="fa-brands fa-github"></i>
                        GitHub
                    </a>

                ` : ''}
                ${project.website ? `
                    <a href="${project.website}"
                       class="project-btn"
                       target="_blank"
                       rel="noopener noreferrer">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        Visit Website
                    </a>
                    
                ` : ''}
            </div>
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

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 200)
            current = section.id;
    });

    navLinks.forEach(link =>
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`)
    );
});
loadProjects();