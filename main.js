const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar-nav a');

function updateActiveLink() {
    let current = '';

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${current}`
        );
    });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

async function loadProjects() {
    const container = document.querySelector('.projects-container');

    if (!container) return;

    try {
        const response = await fetch('./projects.json');

        if (!response.ok) {
            throw new Error(
                `projects.json returned HTTP ${response.status}`
            );
        }

        const projects = await response.json();

        if (!Array.isArray(projects)) {
            throw new Error('projects.json must contain an array.');
        }

        container.replaceChildren();

        projects.forEach(project => {
            const card = document.createElement('article');
            card.className = 'project-card';

            const content = document.createElement('div');
            content.className = 'project-content';

            const title = document.createElement('h3');
            title.textContent = project.title || 'Untitled Project';

            const description = document.createElement('p');
            description.textContent = project.description || '';

            const detailedDescription = document.createElement('div');
            detailedDescription.className = 'project-detailed-description';
            detailedDescription.textContent = project.detailedDescription || '';

            const links = document.createElement('div');
            links.className = 'project-links';

            function addLink(url, label, icon, download = false) {
                if (!url) return;

                const link = document.createElement('a');
                link.href = url;
                link.innerHTML = `<i class="${icon}"></i> ${label}`;

                if (download) {
                    link.download = '';
                } else {
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                }

                links.appendChild(link);
            }

            addLink(
                project.github,
                'GitHub',
                'fa-brands fa-github'
            );

            addLink(
                project.download,
                'Download APK',
                'fa-solid fa-download',
                true
            );

            addLink(
                project.website,
                'Visit Website',
                'fa-solid fa-arrow-up-right-from-square'
            );

          content.append(title,
              description,
              detailedDescription,
              links
          );
            card.appendChild(content);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Unable to load projects:', error);
        container.textContent =
            'Unable to load projects. Check the browser console for details.';
    }
}

loadProjects();
