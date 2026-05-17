document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    let activeProjects = [];

    // Dictionary of static translations
    const translations = {
        pt: {
            subtitle: "Desenvolvedor Full Stack nas horas vagas ☕",
            collabTitle: "Colaboradores",
            btnProject: "Ver Projeto",
            loading: "Carregando projetos...",
            error: "Erro ao carregar os projetos."
        },
        en: {
            subtitle: "Full Stack Developer in spare time ☕",
            collabTitle: "Collaborators",
            btnProject: "View Project",
            loading: "Loading projects...",
            error: "Error loading projects."
        },
        es: {
            subtitle: "Desarrollador Full Stack en el tiempo libre ☕",
            collabTitle: "Colaboradores",
            btnProject: "Ver Proyecto",
            loading: "Cargando proyectos...",
            error: "Error al cargar los proyectos."
        }
    };

    // Detect and initialize active language (persisting user preference)
    let currentLang = localStorage.getItem('portfolio-lang');
    if (!currentLang) {
        const browserLang = (navigator.language || navigator.userLanguage || 'pt').substring(0, 2);
        currentLang = ['pt', 'en', 'es'].includes(browserLang) ? browserLang : 'pt';
    }

    // Helper to get localized description
    function getProjectDescription(project) {
        if (!project.description) return '';
        if (typeof project.description === 'object') {
            return project.description[currentLang] || project.description['pt'] || project.description['en'] || '';
        }
        return project.description;
    }

    // 1. Update static elements on screen
    function updateStaticTexts() {
        const subtitleEl = document.querySelector('[data-i18n="subtitle"]');
        if (subtitleEl) {
            subtitleEl.textContent = translations[currentLang].subtitle;
        }

        // Highlight active language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 2. Setup Language Switcher Listeners
    function setupLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedLang = e.target.getAttribute('data-lang');
                if (selectedLang && selectedLang !== currentLang) {
                    currentLang = selectedLang;
                    localStorage.setItem('portfolio-lang', currentLang);
                    updateStaticTexts();
                    renderProjects();
                    setupScrollReveal(); // Re-apply scroll reveal animations for newly rendered grid items
                }
            });
        });
    }

    // 3. Load projects from projects.json or fallback projects.js (for file:// protocol compatibility)
    async function loadProjects() {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) throw new Error('Não foi possível carregar projects.json');
            activeProjects = await response.json();
            console.log('🚀 Projetos carregados do arquivo de configuração (JSON).');
        } catch (error) {
            console.warn('⚠️ Erro ao carregar projects.json (comum em acesso local via file://). Usando fallback de projects.js:', error);
            if (typeof projects !== 'undefined') {
                activeProjects = projects;
            } else {
                activeProjects = [];
                grid.innerHTML = `<div class="grid-item error">${translations[currentLang].error}</div>`;
                return;
            }
        }
        renderProjects();
        setupScrollReveal();
    }

    // 4. Render Projects in Bento Grid
    function renderProjects() {
        grid.innerHTML = '';
        if (activeProjects.length === 0) {
            grid.innerHTML = `<div class="grid-item loading">${translations[currentLang].loading}</div>`;
            return;
        }

        activeProjects.forEach(project => {
            if (project.disabled) return;
            const item = document.createElement('div');
            item.className = `grid-item ${project.type}`;
            item.setAttribute('data-id', project.id);
            item.style.backgroundImage = `url(${project.image})`;
            item.style.backgroundSize = 'cover';
            item.style.backgroundPosition = 'center';

            // Set dynamic CSS variable for custom hover border and shadow glows
            if (project.highlightColor) {
                item.style.setProperty('--highlight-color', project.highlightColor);
            }

            item.innerHTML = `
                <div class="content">
                    <h3>${project.title}</h3>
                    <p>${getProjectDescription(project)}</p>
                </div>
            `;

            item.addEventListener('click', () => openModal(project));
            grid.appendChild(item);
        });
    }

    // Helper to get raw inline SVG for collaborator icons
    function getCollaboratorIconSVG(iconName) {
        const icons = {
            github: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`,
            linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
            instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
            default: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 0 1 0 10h-2"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>`
        };
        return icons[iconName] || icons.default;
    }

    // 5. Modal Logic with custom theme matching highlightColor
    function openModal(project) {
        const themeColor = project.highlightColor || 'var(--accent-primary)';

        // Detect if color is white or extremely light (e.g. #ffffff) to adjust button text contrast
        const isWhite = themeColor.toLowerCase() === '#ffffff' ||
            themeColor.toLowerCase() === '#fff' ||
            themeColor === 'rgb(255, 255, 255)';
        const buttonTextColor = isWhite ? '#0a0a0c' : '#ffffff';

        let collaboratorsHTML = '';
        if (project.collaborators && project.collaborators.length > 0) {
            collaboratorsHTML = `
                <div class="project-collaborators" style="margin-bottom: 2rem; border-top: 1px solid var(--card-border); padding-top: 1.5rem;">
                    <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-secondary); margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> ${translations[currentLang].collabTitle}
                    </h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.8rem;">
                        ${project.collaborators.map(c => `
                            <a href="${c.url}" target="_blank" rel="noopener noreferrer" class="collaborator-link" style="
                                display: inline-flex;
                                align-items: center;
                                gap: 8px;
                                background: rgba(255, 255, 255, 0.03);
                                border: 1px solid var(--card-border);
                                padding: 8px 16px;
                                border-radius: 12px;
                                color: var(--text-primary);
                                text-decoration: none;
                                font-size: 0.9rem;
                                font-weight: 600;
                                transition: all 0.3s ease;
                            " onmouseover="this.style.background='rgba(255, 255, 255, 0.08)'; this.style.borderColor='${themeColor}'; this.style.transform='translateY(-2px)';"
                               onmouseout="this.style.background='rgba(255, 255, 255, 0.03)'; this.style.borderColor='var(--card-border)'; this.style.transform='none';">
                                ${getCollaboratorIconSVG(c.icon)}
                                ${c.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        modalBody.innerHTML = `
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem; font-family: 'Outfit', sans-serif;">${project.title}</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                ${project.tags.map(tag => `
                    <span class="tag" style="
                        background: color-mix(in srgb, ${themeColor} 15%, transparent); 
                        color: ${themeColor}; 
                        border: 1px solid color-mix(in srgb, ${themeColor} 30%, transparent);
                        padding: 6px 14px; 
                        border-radius: 20px; 
                        font-size: 0.8rem;
                        font-weight: 600;
                    ">${tag}</span>
                `).join('')}
            </div>
            <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 2.5rem; line-height: 1.8;">
                ${getProjectDescription(project)}
            </p>
            ${collaboratorsHTML}
            <div class="modal-links">
                <a href="${project.url}" target="_blank" class="btn" style="
                    display: inline-flex; 
                    align-items: center; 
                    gap: 10px;
                    background: ${themeColor}; 
                    color: ${buttonTextColor}; 
                    padding: 14px 28px; 
                    border-radius: 14px; 
                    text-decoration: none; 
                    font-weight: bold;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 24px -4px color-mix(in srgb, ${themeColor} 40%, transparent);
                " onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px -4px color-mix(in srgb, ${themeColor} 70%, transparent)';" 
                   onmouseout="this.style.transform='none'; this.style.boxShadow='0 8px 24px -4px color-mix(in srgb, ${themeColor} 40%, transparent)';"
                >
                    ${translations[currentLang].btnProject} <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
            </div>
        `;

        modal.style.display = 'flex';
        // Trigger reflow to start transition
        modal.offsetHeight;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Avoid background scrolling

        lucide.createIcons(); // Render lucide icons in dynamic markup
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore page scrolling
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Must match CSS opacity transition duration
    }

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Handle Escape key to close modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // 6. Simple Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    function setupScrollReveal() {
        document.querySelectorAll('.grid-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.6s ease-out';
            observer.observe(item);
        });
    }

    // Initialize UI and Switcher
    updateStaticTexts();
    setupLanguageSwitcher();

    // Load dynamic content
    loadProjects();
});
