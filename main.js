
async function loadProjects() {
    try {
        const response = await fetch('projects.json');

        if (!response.ok) {
            throw new Error('Failed to load projects.json');
        }

        const projects = await response.json();
        const container = document.querySelector('.projects-container');
        
        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.classList.add('project-card');
            card.classList.add(
                index % 2 === 0 ? 'project-card--odd' : 'project-card--even'
            );

            card.innerHTML = `
                <div class="project-image-container">
                    <img src="${project.image}" alt="${project.title}">

                    <div class="project-description-panel">
                        <h4>About this project</h4>
                        <p>${project.detailedDescription || project.description}</p>
                    </div>
                </div>

                <h3>${project.title}</h3>
                <p>${project.description}</p>

                <div class="project-buttons">
                    ${project.download ? `<a href="${project.download}" class="project-btn" download>Download APK</a>` : ''}
                    ${project.github ? `<a href="${project.github}" class="project-btn" target="_blank" rel="noopener noreferrer">GitHub</a>` : ''}
                    ${project.website ? `<a href="${project.website}" class="project-btn" target="_blank" rel="noopener noreferrer">Visit Website</a>` : ''}
                </div>
            `;

            container.appendChild(card);

            card.addEventListener('mouseenter', () => {
                if (card.classList.contains('project-expanded')) return;
                openProject(card);
            });
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}


function openProject(card) {
    if (document.querySelector('.project-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'project-overlay';

    const closeButton = document.createElement('button');
    closeButton.className = 'project-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close project');

    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);

    // Pause the card's floating animation before measuring it
    card.style.animationPlayState = 'paused';

    const rect = card.getBoundingClientRect();

    const originalPosition = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
    };

    const placeholder = document.createElement('div');
    placeholder.className = 'project-placeholder';
    placeholder.style.width = `${originalPosition.width}px`;
    placeholder.style.height = `${originalPosition.height}px`;
    placeholder.style.flexShrink = '0';

    card.parentNode.insertBefore(placeholder, card);

    // Freeze the card at its original viewport position
    card.style.position = 'fixed';
    card.style.top = `${rect.top}px`;
    card.style.left = `${rect.left}px`;
    card.style.width = `${rect.width}px`;
    card.style.height = `${rect.height}px`;
    card.style.margin = '0';
    card.style.zIndex = '1001';

    card.classList.add('project-expanded');

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
            card.classList.add('expanded');

            card.style.top = '50%';
            card.style.left = '50%';
            card.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    let closing = false;
    let cleanupTimer;

    function cleanup() {
        if (!closing) return;

        clearTimeout(cleanupTimer);
        card.removeEventListener('transitionend', onTransitionEnd);

        // Restore the card to its original place in the layout
        card.classList.remove('project-expanded', 'expanded');
        card.removeAttribute('style');

        placeholder.parentNode.insertBefore(card, placeholder);
        placeholder.remove();
        overlay.remove();
    }

    function onTransitionEnd(e) {
        if (e.target === card && e.propertyName === 'transform') {
            cleanup();
        }
    }

    function closeProject() {
        if (closing) return;
        closing = true;

        card.classList.remove('expanded');
        overlay.classList.remove('visible');

        // Use the saved original viewport coordinates,
        // not a newly calculated position.
        card.style.top = `${rect.top}px`;
        card.style.left = `${rect.left}px`;
        card.style.width = `${rect.width}px`;
        card.style.height = `${rect.height}px`;
        card.style.transform = 'none';

        card.addEventListener('transitionend', onTransitionEnd);

        // Fallback in case the transition event never fires
        cleanupTimer = setTimeout(cleanup, 500);

        document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') closeProject();
    }

    closeButton.addEventListener('click', closeProject);

    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeProject();
    });

    document.addEventListener('keydown', onKeyDown);
}


// Contact form
const form = document.querySelector('.contact-form');

if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();

        const data = new FormData(form);

        try {
            const response = await fetch(
                'https://api.web3forms.com/submit',
                {
                    method: 'POST',
                    body: data,
                    headers: {
                        Accept: 'application/json'
                    }
                }
            );

            if (response.ok) {
                form.innerHTML =
                    '<p style="font-size:1.8rem;">Thanks! Your message has been sent.</p>';
            } else {
                alert('Oops! Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            alert('Unable to send your message. Please check your connection and try again.');
        }
    });
}

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar a');

window.addEventListener('scroll', () => {
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
});

loadProjects();
