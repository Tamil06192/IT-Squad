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

                if (window.innerWidth <= 768 && sidebar) {
                    sidebar.classList.remove('active');
                    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
                }
            });
        });

        // Initialize first tab visibility
        const activeTab = document.querySelector('.sidebar-menu a.active[data-tab]');
        if (activeTab) {
            const target = document.getElementById(activeTab.getAttribute('data-tab'));
            if (target) {
                target.style.display = 'block';
                target.style.opacity = '1';
            }
        }
    }

    // Dashboard Sub-tab Logic
    const subTabLinks = document.querySelectorAll('.sub-tab-nav a[data-sub-tab]');
    if (subTabLinks.length > 0) {
        subTabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const parentTab = link.closest('.tab-content');
                if (!parentTab) return;

                const targetId = link.getAttribute('data-sub-tab');
                const subContents = parentTab.querySelectorAll('.sub-tab-content');
                const parentLinks = parentTab.querySelectorAll('.sub-tab-nav a');

                // Update navigation links
                parentLinks.forEach(l => {
                    l.classList.remove('active');
                    l.style.borderBottom = 'none';
                    l.style.color = 'var(--text-muted)';
                    l.style.fontWeight = '400';
                });

                // Hide all sub-contents in this parent tab
                subContents.forEach(c => c.style.display = 'none');

                // Activate clicked sub-tab
                link.classList.add('active');
                link.style.borderBottom = '2px solid var(--primary)';
                link.style.color = 'var(--primary)';
                link.style.fontWeight = '600';

                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                    targetContent.classList.add('animate-fade-in');
                }
            });
        });
    }

    /* -------------------------------------------------------------------------- */
    /*                            ApexCharts Integration                         */
    /* -------------------------------------------------------------------------- */
    const charts = {};

    function getChartTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function initDashboardCharts() {
        const theme = getChartTheme();
        const commonOptions = {
            chart: {
                parentHeightOffset: 0,
                toolbar: { show: false },
                background: 'transparent',
                foreColor: 'var(--text-muted)',
                fontFamily: 'inherit'
            },
            theme: { mode: theme },
            grid: {
                borderColor: 'var(--border)',
                strokeDashArray: 4
            },
            stroke: { curve: 'smooth', width: 2 },
            colors: ['#4F46E5', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#06B6D4']
        };

        // --- Admin Dashboard Charts ---

        // 1. Incoming Ticket Volume (Line)
        if (document.getElementById('incoming-volume-chart')) {
            charts.incomingVolume = new ApexCharts(document.getElementById('incoming-volume-chart'), {
                ...commonOptions,
                series: [{ name: 'Tickets', data: [31, 40, 28, 51, 42, 109, 100] }],
                xaxis: { categories: ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'] },
                chart: { ...commonOptions.chart, type: 'area' }
            });
            charts.incomingVolume.render();
        }

        // 2. User Growth (Bar)
        if (document.getElementById('user-growth-chart')) {
            charts.userGrowth = new ApexCharts(document.getElementById('user-growth-chart'), {
                ...commonOptions,
                series: [{ name: 'New Users', data: [44, 55, 57, 56, 61, 58, 63, 60, 66] }],
                xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] },
                chart: { ...commonOptions.chart, type: 'bar' }
            });
            charts.userGrowth.render();
        }

        // 3. SLA Compliance (RadialBar)
        if (document.getElementById('sla-compliance-chart')) {
            charts.sla = new ApexCharts(document.getElementById('sla-compliance-chart'), {
                ...commonOptions,
                series: [100, 98.5, 97.2],
                labels: ['Gold', 'Silver', 'Bronze'],
                chart: { ...commonOptions.chart, type: 'radialBar' },
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            total: {
                                show: true,
                                label: 'SLA',
                                formatter: () => '98.5%'
                            }
                        }
                    }
                }
            });
            charts.sla.render();
        }

        // 4. Dept Distribution (Donut)
        if (document.getElementById('dept-distribution-chart')) {
            charts.deptDist = new ApexCharts(document.getElementById('dept-distribution-chart'), {
                ...commonOptions,
                series: [35, 25, 20, 20],
                labels: ['IT Support', 'HR', 'Finance', 'Sales'],
                chart: { ...commonOptions.chart, type: 'donut' }
            });
            charts.deptDist.render();
        }

        // 5. Agent Status (Pie/Donut)
        if (document.getElementById('agent-status-chart')) {
            charts.agentStatus = new ApexCharts(document.getElementById('agent-status-chart'), {
                ...commonOptions,
                series: [12, 6, 4, 3],
                labels: ['Online', 'Away', 'Busy', 'Offline'],
                chart: { ...commonOptions.chart, type: 'pie' }
            });
            charts.agentStatus.render();
        }

        // 6. Resolution Time Trend (Area)
        if (document.getElementById('resolution-trend-chart')) {
            charts.resolutionTrend = new ApexCharts(document.getElementById('resolution-trend-chart'), {
                ...commonOptions,
                series: [{ name: 'Avg Hours', data: [4.5, 3.8, 5.2, 4.1, 3.5, 3.2, 2.8] }],
                xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
                chart: { ...commonOptions.chart, type: 'area' }
            });
            charts.resolutionTrend.render();
        }

        // --- User Dashboard Charts ---

        // 1. User Ticket Volume (Bar)
        if (document.getElementById('user-volume-chart')) {
            charts.userVolume = new ApexCharts(document.getElementById('user-volume-chart'), {
                ...commonOptions,
                series: [{ name: 'Tickets', data: [4, 6, 3, 8, 5, 7] }],
                xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
                chart: { ...commonOptions.chart, type: 'bar' }
            });
            charts.userVolume.render();
        }

        // 2. Ticket Distribution (Donut)
        if (document.getElementById('ticket-dist-chart')) {
            charts.ticketDist = new ApexCharts(document.getElementById('ticket-dist-chart'), {
                ...commonOptions,
                series: [60, 25, 15],
                labels: ['Resolved', 'Open', 'Critical'],
                chart: { ...commonOptions.chart, type: 'donut' }
            });
            charts.ticketDist.render();
        }

        // 3. Weekly Resolution Trend (Area/Line)
        if (document.getElementById('weekly-resolution-chart')) {
            charts.weeklyTrend = new ApexCharts(document.getElementById('weekly-resolution-chart'), {
                ...commonOptions,
                series: [{ name: 'Resolved', data: [10, 15, 8, 20, 18, 25, 30] }],
                xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
                chart: { ...commonOptions.chart, type: 'area' }
            });
            charts.weeklyTrend.render();
        }

        if (document.getElementById('request-types-chart')) {
            charts.requestTypes = new ApexCharts(document.getElementById('request-types-chart'), {
                ...commonOptions,
                series: [40, 30, 30],
                labels: ['Hardware', 'Software', 'Network'],
                chart: { ...commonOptions.chart, type: 'donut' }
            });
            charts.requestTypes.render();
        }

        // 5. Support Channels (Donut)
        if (document.getElementById('support-channels-chart')) {
            charts.supportChannels = new ApexCharts(document.getElementById('support-channels-chart'), {
                ...commonOptions,
                series: [45, 35, 20],
                labels: ['Email', 'Chat', 'Phone'],
                chart: { ...commonOptions.chart, type: 'donut' }
            });
            charts.supportChannels.render();
        }

        // 6. Satisfaction Score (RadialBar)
        if (document.getElementById('satisfaction-score-chart')) {
            charts.satisfaction = new ApexCharts(document.getElementById('satisfaction-score-chart'), {
                ...commonOptions,
                series: [88],
                labels: ['Satisfaction'],
                chart: { ...commonOptions.chart, type: 'radialBar' },
                plotOptions: {
                    radialBar: {
                        hollow: { size: '70%' },
                        dataLabels: {
                            name: { show: false },
                            value: {
                                show: true,
                                fontSize: '24px',
                                formatter: (val) => val + '%'
                            }
                        }
                    }
                }
            });
            charts.satisfaction.render();
        }
    }

    initDashboardCharts();

    // Update charts theme when theme toggles
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            setTimeout(() => {
                const newTheme = getChartTheme();
                Object.values(charts).forEach(chart => {
                    chart.updateOptions({
                        theme: { mode: newTheme }
                    });
                });
            }, 50); // Small delay to let DOM update
        });
    }

    // Simulate Live Data for Incoming Volume
    setInterval(() => {
        if (charts.incomingVolume) {
            const newData = [...charts.incomingVolume.w.config.series[0].data];
            newData.shift();
            newData.push(Math.floor(Math.random() * 50) + 10);
            charts.incomingVolume.updateSeries([{ data: newData }]);
        }
    }, 5000);
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
