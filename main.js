document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.className = theme === 'light' ? 'bx bx-moon' : 'bx bx-sun';
    }

    // Mobile Menu
    const menuBtn = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'bx bx-x';
            } else {
                icon.className = 'bx bx-menu';
            }
        });
    }

    // Dropdown Menu Click Functionality
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');

        if (dropdownLink) {
            dropdownLink.addEventListener('click', (e) => {
                e.preventDefault();

                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });

                // Toggle current dropdown
                dropdown.classList.toggle('active');
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;

            // Close other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const icon = otherItem.querySelector('i');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                }
            });

            item.classList.toggle('active');

            // Rotate icon
            const icon = question.querySelector('i');
            if (icon) {
                icon.style.transform = item.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    });
    // Dashboard Sidebar Toggle
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
        });

        // Close sidebar when clicking overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        }
    }

    // Dashboard Tab Logic
    const tabLinks = document.querySelectorAll('.sidebar-menu a[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabLinks.length > 0 && tabContents.length > 0) {
        tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // If it's a real link (logout), don't prevent default
                if (!link.getAttribute('href').startsWith('#') && link.getAttribute('href') !== '#') return;

                e.preventDefault();
                const targetId = link.getAttribute('data-tab');

                // Remove active class from all links and contents
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => c.style.display = 'none');

                // Add active class to clicked link and show target content
                link.classList.add('active');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                    // Trigger reflow/animation if needed
                    targetContent.classList.add('animate-fade-in');
                }

                // Close mobile sidebar on selection
                if (window.innerWidth <= 768 && sidebar) {
                    sidebar.classList.remove('active');
                    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                }
            });
        });

        // Activate first tab by default if none active
        // (Assuming HTML sets style="display:none" on others)
    }
});

// Global Function for Interactive Charts
window.updateChartCenter = function (chartContainerId, title, value) {
    const container = document.getElementById(chartContainerId);
    if (!container) return;

    const valueEl = container.querySelector('.chart-value');
    const labelEl = container.querySelector('.chart-label');

    if (valueEl) valueEl.textContent = value;
    if (labelEl) labelEl.textContent = title;
};

/* -------------------------------------------------------------------------- */
/*                                Admin Modal                                 */
/* -------------------------------------------------------------------------- */
const addUserBtn = document.getElementById('add-user-btn');
const addUserModal = document.getElementById('add-user-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelModalBtn = document.getElementById('cancel-modal');

if (addUserBtn && addUserModal) {
    addUserBtn.addEventListener('click', () => {
        addUserModal.style.display = 'flex';
    });

    const closeModal = () => {
        addUserModal.style.display = 'none';
    };

    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    // Close on outside click
    addUserModal.addEventListener('click', (e) => {
        if (e.target === addUserModal) closeModal();
    });
}

/* -------------------------------------------------------------------------- */
/*                              Stats Counter                                 */
/* -------------------------------------------------------------------------- */
const stats = document.querySelectorAll('.stat-number');

if (stats.length > 0) {
    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseFloat(target.getAttribute('data-target'));
                const suffix = target.innerText.replace(/[0-9.]/g, ''); // Get non-numeric chars

                let start = 0;
                const duration = 2000;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out quart
                    const ease = 1 - Math.pow(1 - progress, 4);

                    const currentVal = Math.floor(value * ease);

                    // Handle decimals if target has decimal
                    if (value % 1 !== 0) {
                        target.innerText = (value * ease).toFixed(1) + suffix;
                    } else {
                        target.innerText = Math.floor(value * ease) + suffix;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        target.innerText = value + suffix;
                    }
                };

                requestAnimationFrame(updateCount);
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));
}
