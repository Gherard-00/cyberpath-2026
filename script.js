/* ============================================
   CyberPath 2026 — Interactive Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');

    if (navbar && scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 50;
            navbar.classList.toggle('scrolled', scrolled);

            // Progress bar
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        });
    }

    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        // Close mobile nav on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinksAll.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Phase tabs code removed — current index.html uses
    // .course-phase cards instead of .phase-tab elements.

    // --- Animated Counters ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        countersAnimated = true;

        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + '+';
                }
            };
            updateCounter();
        });
    };

    // Trigger counters when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

    // --- Terminal Typewriter Effect ---
    const typewriterEl = document.getElementById('typewriter');
    const commands = [
        'nmap -sS -sV -T4 10.0.2.15',
        'msfconsole -q',
        'python3 vol.py -f memory.raw windows.pslist',
        'hydra -l admin -P wordlist.txt ssh://target',
        'wireshark -i eth0 -k',
        'burpsuite &',
        'airmon-ng start wlan0',
        'autopsy --create-case incident_2026',
        'hashcat -m 0 hashes.txt rockyou.txt',
        'gobuster dir -u http://target -w dirs.txt'
    ];

    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    let typewriterPaused = false;

    // Pause typewriter when tab is hidden to save resources
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            typewriterPaused = true;
        } else {
            typewriterPaused = false;
            typeEffect();
        }
    });

    function typeEffect() {
        if (typewriterPaused) return;
        const currentCmd = commands[cmdIndex];

        if (!isDeleting && !isPaused) {
            typewriterEl.textContent = currentCmd.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentCmd.length) {
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    typeEffect();
                }, 2000);
                return;
            }
        } else if (isDeleting) {
            typewriterEl.textContent = currentCmd.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                cmdIndex = (cmdIndex + 1) % commands.length;
            }
        }

        const speed = isDeleting ? 30 : 60;
        setTimeout(typeEffect, speed);
    }

    if (typewriterEl) typeEffect();

    // --- Metric Checkboxes ---
    document.querySelectorAll('.metric-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('completed');
            const check = item.querySelector('.metric-check');
            if (item.classList.contains('completed')) {
                check.textContent = '☑';
            } else {
                check.textContent = '☐';
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll(
        '.module-card, .tool-card, .lab-card, .cert-card, .prereq-card, ' +
        '.community-card, .weekly-block, .forensic-step'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index % 6 * 0.08}s, transform 0.5s ease ${index % 6 * 0.08}s`;
        revealObserver.observe(el);
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 20;
                const position = target.offsetTop - offset;
                window.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Keyboard navigation for phase tabs removed — phase tabs
    // no longer exist in the current layout.

});
