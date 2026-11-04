/* ============================================
   CyberPath 2026 — Interactive Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    let scrollProgress = document.getElementById('scrollProgress');
    if (navbar && !scrollProgress) {
        const navProgressWrap = document.createElement('div');
        navProgressWrap.className = 'nav-progress';
        scrollProgress = document.createElement('div');
        scrollProgress.className = 'nav-progress-bar';
        scrollProgress.id = 'scrollProgress';
        navProgressWrap.appendChild(scrollProgress);
        navbar.appendChild(navProgressWrap);
    }

    if (navbar && scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY > 50;
            navbar.classList.toggle('scrolled', scrolled);

            // Progress bar
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0
                ? Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100))
                : 0;
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
            const suffix = stat.dataset.suffix || '';
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + suffix;
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

    // Metric checkboxes removed — no HTML elements use .metric-item.
    // The CSS (.metric-item, .metric-check) is retained for potential future use.

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.course-phase, .resource-card');

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
                const offset = navbar ? navbar.offsetHeight + 20 : 20;
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

    // --- Hook global de localStorage y restauración de explicaciones de Quiz ---
    try {
        installProgressStorageHook();
        initQuizExplanationObserver();
    } catch (e) {
        console.error('Error al inicializar hooks de progreso/quiz:', e);
    }

    // --- Progreso por Fase + Franja actual (Lote 3) ---
    // Aislado para que un fallo aquí nunca impida iniciar el chat.
    try {
        initPhaseProgress();
    } catch (e) {
        console.error('Error al pintar el progreso por fase:', e);
    }

    // --- AI Chatbot Integration (Ollama) ---
    initAIChatbot();

});

/* ============================================
   Progreso por Fase y Franja de carrera (Lote 3)
   Lee CyberQuiz.getProgress() (quiz.js, solo lectura) y actualiza:
   - .phase-progress__item[data-phase]: conteo X/Y, ancho del fill,
     aria-valuenow/valuemax y .is-complete al 100 %.
   - #careerTrack: .is-done en franjas completas; .is-current +
     aria-current="step" + "ESTÁS AQUÍ" en la franja de la primera
     fase incompleta.
   - #courseProgressText: "X / N lecciones completadas".
   ============================================ */

/** Mismo patrón que applyBadges() de quiz.js para obtener el id de lección (case-insensitive). */
const LESSON_ID_PATTERN = /leccion-(\d{2}[a-z]?)/i;

/** Evita registrar listeners duplicados si initPhaseProgress() se invoca más de una vez. */
let phaseProgressListenersBound = false;

/**
 * Normaliza el mapa de progreso a claves en minúsculas.
 * @param {Object} progress
 * @returns {Object<string, {completed?: boolean}>}
 */
function normalizeProgressMap(progress) {
    const normalized = {};
    if (progress && typeof progress === 'object' && !Array.isArray(progress)) {
        for (const [k, v] of Object.entries(progress)) {
            if (v && typeof v === 'object') {
                normalized[k.toLowerCase()] = v;
            }
        }
    }
    return normalized;
}

/**
 * Lee el progreso guardado sin romper si quiz.js no está cargado.
 * @returns {Object<string, {completed?: boolean}>}
 */
function readCourseProgress() {
    if (typeof CyberQuiz === 'undefined' || typeof CyberQuiz.getProgress !== 'function') {
        return {};
    }
    const progress = CyberQuiz.getProgress();
    return progress && typeof progress === 'object' && !Array.isArray(progress) ? progress : {};
}

/**
 * Sincroniza los badges visuales (.completed y .lesson-completed-badge) de las tarjetas
 * .lesson-card al volver desde BFCache (pageshow), cambiar otra pestaña (storage),
 * usar claves con sufijo en mayúsculas (ej. leccion-07B) o reiniciar el progreso.
 * @param {Object} progress
 */
function syncLessonCardBadges(progress) {
    if (typeof CyberQuiz !== 'undefined' && typeof CyberQuiz.applyBadges === 'function') {
        try {
            CyberQuiz.applyBadges();
        } catch (e) {
            // Continuar con la sincronización normalizada
        }
    }
    const normalized = normalizeProgressMap(progress);
    document.querySelectorAll('.lesson-card[href]').forEach(card => {
        const href = card.getAttribute('href');
        if (!href) return;
        const match = href.match(LESSON_ID_PATTERN);
        if (!match) return;

        const isDone = normalized[`leccion-${match[1].toLowerCase()}`]?.completed === true;
        const numberEl = card.querySelector('.lesson-number');

        if (isDone) {
            card.classList.add('completed');
            if (numberEl && !numberEl.querySelector('.lesson-completed-badge')) {
                numberEl.style.position = 'relative';
                const badge = document.createElement('span');
                badge.className = 'lesson-completed-badge';
                badge.textContent = '\u2713';
                numberEl.appendChild(badge);
            }
        } else {
            card.classList.remove('completed');
            if (numberEl) {
                const staleBadge = numberEl.querySelector('.lesson-completed-badge');
                if (staleBadge && typeof staleBadge.remove === 'function') {
                    staleBadge.remove();
                }
            }
        }
    });
}

/**
 * Calcula, por fase, cuántas lecciones del temario están completadas.
 * Solo cuenta las tarjetas .lesson-card (no los chips de prerrequisitos).
 * @returns {Array<{phase: string, track: string, total: number, done: number}>}
 */
function computePhaseStats(progress) {
    const normalized = normalizeProgressMap(progress);
    return Array.from(document.querySelectorAll('.course-phase[data-phase]')).map(phaseEl => {
        const cards = phaseEl.querySelectorAll('.lesson-card[href]');
        let done = 0;
        cards.forEach(card => {
            const match = card.getAttribute('href').match(LESSON_ID_PATTERN);
            if (match && normalized[`leccion-${match[1].toLowerCase()}`]?.completed === true) done++;
        });
        return {
            phase: phaseEl.dataset.phase,
            track: phaseEl.dataset.track || '',
            total: cards.length,
            done
        };
    });
}

/**
 * Recalcula y pinta el progreso segmentado por fase (#phaseProgress),
 * el resumen (#courseProgressText), la franja activa (#careerTrack)
 * y los badges de completado de las tarjetas (.lesson-card).
 */
function updatePhaseProgress() {
    const container = document.getElementById('phaseProgress');
    // script.js también se carga en las lecciones: solo actúa en el temario.
    if (!container) return;

    const progress = readCourseProgress();
    syncLessonCardBadges(progress);

    const stats = computePhaseStats(progress);
    // Una fase sin lecciones no bloquea el avance.
    const isComplete = s => s.done >= s.total;

    let doneTotal = 0;
    let lessonTotal = 0;

    stats.forEach(s => {
        doneTotal += s.done;
        lessonTotal += s.total;

        const item = container.querySelector(
            `.phase-progress__item[data-phase="${s.phase}"], .phase-progress__item[data-phase-bar="${s.phase}"]`
        );
        if (!item) return;
        const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;

        const count = item.querySelector('.phase-progress__count');
        if (count) count.textContent = `${s.done}/${s.total}`;

        const bar = item.querySelector('.phase-progress__track');
        if (bar) {
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', String(s.total));
            bar.setAttribute('aria-valuenow', String(s.done));
            bar.setAttribute('aria-valuetext', `${s.done} de ${s.total} lecciones`);
        }

        const fill = item.querySelector('.phase-progress__fill');
        if (fill) fill.style.width = `${pct}%`;

        item.classList.toggle('is-complete', s.total > 0 && isComplete(s));
    });

    const summary = document.getElementById('courseProgressText');
    if (summary) summary.textContent = `${doneTotal} / ${lessonTotal} lecciones completadas`;

    // Franja actual = franja de la primera fase incompleta.
    // Si todas las fases del curso están 100% completas, mantener actual / "ESTÁS AQUÍ" en Professional.
    const firstIncomplete = stats.find(s => !isComplete(s));
    const currentTrack = firstIncomplete
        ? firstIncomplete.track
        : (stats.length > 0 ? stats[stats.length - 1].track : 'professional');

    document.querySelectorAll('#careerTrack .career-track__step[data-track]').forEach(step => {
        const track = step.dataset.track;
        const trackPhases = stats.filter(s => s.track === track);
        const trackDone = trackPhases.length > 0 && trackPhases.every(isComplete);
        const isCurrent = track === currentTrack;

        step.classList.toggle('is-done', trackDone);
        step.classList.toggle('is-current', isCurrent);
        if (isCurrent) {
            step.setAttribute('aria-current', 'step');
        } else {
            step.removeAttribute('aria-current');
        }

        step.querySelectorAll('.career-track__here').forEach(el => el.remove());
        if (isCurrent) {
            const tag = document.createElement('span');
            tag.className = 'career-track__here';
            tag.textContent = 'ESTÁS AQUÍ';
            step.appendChild(tag);
        }
    });
}

let phaseHighlightTimer = null;

function clearPhaseHighlights() {
    if (phaseHighlightTimer) {
        clearTimeout(phaseHighlightTimer);
        phaseHighlightTimer = null;
    }
    document.querySelectorAll('.course-phase.is-highlighted').forEach(el => {
        el.classList.remove('is-highlighted');
    });
    document.querySelectorAll('.phase-progress__item.is-selected, #careerTrack .career-track__step.is-selected').forEach(el => {
        el.classList.remove('is-selected');
    });
}

function scrollToPhaseElement(targetEl) {
    if (!targetEl || typeof targetEl.scrollIntoView !== 'function') return;
    let smooth = true;
    try {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
    } catch (e) {
        smooth = true;
    }
    targetEl.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
}

function bindPhaseNavigation() {
    document.querySelectorAll('#phaseProgress .phase-progress__item[data-phase]').forEach(item => {
        if (item.dataset.navBound === '1') return;
        item.dataset.navBound = '1';

        const activatePhase = () => {
            const phase = item.dataset.phase;
            const track = item.dataset.track;
            const target = document.querySelector(`.course-phase[data-phase="${phase}"]`);
            if (!target) return;

            clearPhaseHighlights();
            item.classList.add('is-selected');
            if (track) {
                const trackStep = document.querySelector(`#careerTrack .career-track__step[data-track="${track}"]`);
                if (trackStep) trackStep.classList.add('is-selected');
            }
            target.classList.add('is-highlighted');
            scrollToPhaseElement(target);

            phaseHighlightTimer = setTimeout(() => {
                clearPhaseHighlights();
            }, 1800);
        };

        item.addEventListener('click', activatePhase);
        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                activatePhase();
            }
        });
    });

    document.querySelectorAll('#careerTrack .career-track__step[data-track]').forEach(step => {
        if (step.dataset.navBound === '1') return;
        step.dataset.navBound = '1';

        const activateTrack = () => {
            const track = step.dataset.track;
            const phases = Array.from(document.querySelectorAll(`.course-phase[data-track="${track}"]`));
            if (phases.length === 0) return;

            clearPhaseHighlights();
            step.classList.add('is-selected');
            document.querySelectorAll(`#phaseProgress .phase-progress__item[data-track="${track}"]`).forEach(bar => {
                bar.classList.add('is-selected');
            });
            phases.forEach(p => p.classList.add('is-highlighted'));
            scrollToPhaseElement(phases[0]);

            phaseHighlightTimer = setTimeout(() => {
                clearPhaseHighlights();
            }, 1800);
        };

        step.addEventListener('click', activateTrack);
        step.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                activateTrack();
            }
        });
    });
}

let storageHookInstalled = false;
let bypassCompletedOnRetry = false;

function installProgressStorageHook() {
    if (storageHookInstalled) return;
    try {
        if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
            const origGetItem = typeof localStorage.getItem === 'function'
                ? localStorage.getItem.bind(localStorage)
                : null;
            const origSetItem = localStorage.setItem.bind(localStorage);
            const origRemoveItem = typeof localStorage.removeItem === 'function'
                ? localStorage.removeItem.bind(localStorage)
                : null;
            const origClear = typeof localStorage.clear === 'function'
                ? localStorage.clear.bind(localStorage)
                : null;

            if (origGetItem) {
                localStorage.getItem = function (key) {
                    const raw = origGetItem(key);
                    if (key === 'cyberpath_progress' && bypassCompletedOnRetry && raw) {
                        try {
                            const parsed = JSON.parse(raw);
                            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                                for (const entry of Object.values(parsed)) {
                                    if (entry && typeof entry === 'object') {
                                        entry.completed = false;
                                    }
                                }
                                return JSON.stringify(parsed);
                            }
                        } catch (e) {
                            // Devolver valor original si falla el parseo
                        }
                    }
                    return raw;
                };
            }

            localStorage.setItem = function (key, value) {
                let finalValue = value;
                if (key === 'cyberpath_progress' && typeof value === 'string' && origGetItem) {
                    try {
                        const prevRaw = origGetItem('cyberpath_progress');
                        if (prevRaw) {
                            const prev = JSON.parse(prevRaw);
                            const next = JSON.parse(value);
                            if (
                                prev && typeof prev === 'object' && !Array.isArray(prev) &&
                                next && typeof next === 'object' && !Array.isArray(next)
                            ) {
                                let merged = false;
                                for (const [k, prevEntry] of Object.entries(prev)) {
                                    if (
                                        prevEntry &&
                                        typeof prevEntry === 'object' &&
                                        prevEntry.evidenceData !== undefined &&
                                        next[k] &&
                                        typeof next[k] === 'object' &&
                                        next[k].evidenceData === undefined
                                    ) {
                                        next[k].evidenceData = prevEntry.evidenceData;
                                        merged = true;
                                    }
                                }
                                if (merged) {
                                    finalValue = JSON.stringify(next);
                                }
                            }
                        }
                    } catch (err) {
                        // Conservar el valor original si el JSON no es válido
                    }
                }
                origSetItem(key, finalValue);
                if (key === 'cyberpath_progress') updatePhaseProgress();
            };
            if (origRemoveItem) {
                localStorage.removeItem = function (key) {
                    origRemoveItem(key);
                    if (key === 'cyberpath_progress') updatePhaseProgress();
                };
            }
            if (origClear) {
                localStorage.clear = function () {
                    origClear();
                    updatePhaseProgress();
                };
            }
            storageHookInstalled = true;
        }
    } catch (e) {
        // Ignorar si el entorno restringe sobrescribir métodos de localStorage
    }
}

function initQuizExplanationObserver() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    let cachedExplanations = [];

    const parseInlineExplanations = () => {
        if (cachedExplanations.length > 0) return;
        document.querySelectorAll('script:not([src])').forEach(scr => {
            const match = scr.textContent.match(/const\s+explanations\s*=\s*(\[[\s\S]*?\])\s*;/);
            if (match) {
                try {
                    const sanitized = match[1].replace(/,\s*\]$/, ']');
                    const parsed = JSON.parse(sanitized);
                    if (Array.isArray(parsed)) cachedExplanations = parsed;
                } catch (e) {
                    // Ignorar si no es JSON válido
                }
            }
        });
    };

    const captureOrRestoreExplanations = () => {
        parseInlineExplanations();
        const questions = quizContainer.querySelectorAll('.quiz-question');
        if (questions.length === 0) return;

        questions.forEach((q, i) => {
            if (q.dataset.explanation) {
                cachedExplanations[i] = q.dataset.explanation;
            }
        });

        questions.forEach((q, i) => {
            if (!q.dataset.explanation && cachedExplanations[i]) {
                q.dataset.explanation = cachedExplanations[i];
            }
        });
    };

    captureOrRestoreExplanations();

    if (typeof CyberQuiz !== 'undefined' && typeof CyberQuiz.retry === 'function' && !CyberQuiz.retry._wrappedByScript) {
        const origRetry = CyberQuiz.retry.bind(CyberQuiz);
        const wrappedRetry = function (lessonId) {
            bypassCompletedOnRetry = true;
            try {
                return origRetry(lessonId);
            } finally {
                bypassCompletedOnRetry = false;
            }
        };
        wrappedRetry._wrappedByScript = true;
        try {
            CyberQuiz.retry = wrappedRetry;
        } catch (e) {
            // Ignorar si el objeto es de solo lectura
        }
    }

    if (quizContainer.dataset.explanationObsBound !== '1') {
        quizContainer.dataset.explanationObsBound = '1';

        quizContainer.addEventListener('click', e => {
            if (e.target && typeof e.target.closest === 'function' && e.target.closest('.quiz-btn-retry')) {
                bypassCompletedOnRetry = true;
                setTimeout(() => {
                    bypassCompletedOnRetry = false;
                }, 0);
            }
        }, true);

        quizContainer.addEventListener('click', () => {
            bypassCompletedOnRetry = false;
        }, false);

        if (typeof MutationObserver === 'function') {
            const obs = new MutationObserver(() => {
                captureOrRestoreExplanations();
            });
            obs.observe(quizContainer, { childList: true });
        }
    }
}

function initPhaseProgress() {
    installProgressStorageHook();

    const container = document.getElementById('phaseProgress');
    if (!container) return;

    if (typeof window !== 'undefined') {
        window.updatePhaseProgress = updatePhaseProgress;
    }

    updatePhaseProgress();
    bindPhaseNavigation();

    if (phaseProgressListenersBound) return;
    phaseProgressListenersBound = true;

    // Mantener sincronizado si el progreso cambia en otra pestaña
    // o si el navegador restaura la página desde BFCache (botón Atrás).
    window.addEventListener('storage', e => {
        if (e.key === null || e.key === 'cyberpath_progress') updatePhaseProgress();
    });
    window.addEventListener('pageshow', e => {
        if (e.persisted) updatePhaseProgress();
    });
}

function initAIChatbot() {
    // 1. Inyectar HTML del Chatbot con controles extendidos
    const chatHTML = `
        <div id="ai-chatbot-widget" class="ai-chatbot-widget closed">
            <div class="ai-chatbot-header">
                <div class="ai-chatbot-title">
                    <span class="ai-dot"></span> Mentor IA <span class="ai-shortcut-hint">Ctrl+K</span>
                </div>
                <div class="ai-chatbot-header-controls">
                    <button id="ai-chatbot-clear" class="ai-chatbot-action-btn" title="Limpiar conversación">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                    <button id="ai-chatbot-toggle" class="ai-chatbot-toggle" aria-label="Minimizar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7"/></svg>
                    </button>
                </div>
            </div>
            <div id="ai-chatbot-messages" class="ai-chatbot-messages">
                <div class="ai-message system">¡Hola! Soy tu mentor de ciberseguridad sin censura. ¿En qué puedo ayudarte hoy?</div>
            </div>
            <div class="ai-quick-commands">
                <button class="ai-cmd-chip" data-cmd="/resumen">⚡ /resumen</button>
                <button class="ai-cmd-chip" data-cmd="/cheatsheet">📋 /cheatsheet</button>
                <button class="ai-cmd-chip" data-cmd="/quiz">🎯 /quiz</button>
                <button class="ai-cmd-chip" data-cmd="/limpiar">🧹 /limpiar</button>
            </div>
            <div class="ai-chatbot-input-area">
                <textarea id="ai-chatbot-input" placeholder="Pregunta algo o usa /resumen, /quiz..." rows="1"></textarea>
                <button id="ai-chatbot-send" aria-label="Enviar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </button>
            </div>
        </div>
        <button id="ai-chatbot-fab" class="ai-chatbot-fab" aria-label="Abrir Asistente IA">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const widget = document.getElementById('ai-chatbot-widget');
    const fab = document.getElementById('ai-chatbot-fab');
    const toggleBtn = document.getElementById('ai-chatbot-toggle');
    const clearBtn = document.getElementById('ai-chatbot-clear');
    const inputArea = document.getElementById('ai-chatbot-input');
    const sendBtn = document.getElementById('ai-chatbot-send');
    const messagesContainer = document.getElementById('ai-chatbot-messages');

    // Función Global para Copiar Código al Portapapeles
    window.copyAiCode = function(btn) {
        const pre = btn.parentElement;
        const code = pre.querySelector('code');
        if (code) {
            const rawText = code.innerText || code.textContent;
            navigator.clipboard.writeText(rawText).then(() => {
                const originalText = btn.innerText;
                btn.innerText = '¡Copiado!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(err => console.error('Error al copiar:', err));
        }
    };

    // Recuperar e inicializar historial
    let chatHistory = JSON.parse(sessionStorage.getItem('cyberpath_ai_history')) || [];
    
    if (chatHistory.length > 0) {
        const systemMsg = messagesContainer.querySelector('.ai-message.system');
        if (systemMsg) systemMsg.remove();

        chatHistory.forEach(msg => {
            if (msg.role !== 'system') {
                appendMessage(msg.role, msg.content, false);
            }
        });
    } else if (window.location.hostname.endsWith('github.io')) {
        const systemMsg = messagesContainer.querySelector('.ai-message.system');
        if (systemMsg) {
            systemMsg.innerHTML = '👋 <strong>¡Bienvenido a CyberPath 2026 en GitHub Pages!</strong><br><br>Todo el temario (31 lecciones, cheatsheets, glosario y quizzes interactivos) está 100% funcional.<br><br><em>Nota:</em> El Mentor IA interactivo requiere el modelo local Ollama corriendo en tu equipo mediante <code>arrancar_curso.bat</code> o túnel SSH.';
        }
    }

    // Alternar visibilidad del chat
    const toggleChat = () => {
        const isClosed = widget.classList.contains('closed');
        if (isClosed) {
            widget.classList.remove('closed');
            fab.style.transform = 'scale(0)';
            inputArea.focus();
        } else {
            widget.classList.add('closed');
            fab.style.transform = 'scale(1)';
        }
    };

    fab.addEventListener('click', toggleChat);
    toggleBtn.addEventListener('click', toggleChat);

    // Atajos de teclado (Ctrl + K / Cmd + K y Escape)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            toggleChat();
        } else if (e.key === 'Escape' && !widget.classList.contains('closed')) {
            toggleChat();
        }
    });

    // Limpiar Chat
    const clearHistory = () => {
        chatHistory = [];
        sessionStorage.removeItem('cyberpath_ai_history');
        messagesContainer.innerHTML = '<div class="ai-message system">Historial limpiado. ¿En qué más puedo ayudarte?</div>';
    };
    clearBtn.addEventListener('click', clearHistory);

    // Manejar Chips de Comandos Rápidos
    document.querySelectorAll('.ai-cmd-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.dataset.cmd;
            if (cmd === '/limpiar') {
                clearHistory();
            } else if (cmd === '/resumen') {
                inputArea.value = 'Dame un resumen ejecutivo con los 5 puntos clave de esta lección.';
                sendMessage();
            } else if (cmd === '/cheatsheet') {
                inputArea.value = 'Genera una tabla Cheat Sheet con los comandos y herramientas principales mencionados en esta lección.';
                sendMessage();
            } else if (cmd === '/quiz') {
                inputArea.value = 'Hazme 3 preguntas rápidas de autoevaluación sobre esta lección para comprobar mis conocimientos.';
                sendMessage();
            }
        });
    });

    // Auto-ajustar altura de textarea
    inputArea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') this.style.height = 'auto';
    });

    // Enviar con Enter (Shift+Enter para salto de línea)
    inputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    // Formateador Anti-XSS y Markdown Seguro
    function formatMarkdown(text) {
        // 1. Escapar HTML estricto para prevenir XSS de payloads en lecciones
        let safe = String(text || '')
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        // 2. Extraer bloques de código multilínea ```lang\ncódigo``` a placeholders
        //    para evitar que inline-code, negritas o \n -> <br> alteren <pre><code>
        const codeBlocks = [];
        safe = safe.replace(/```(?:[a-zA-Z0-9_-]+[ \t]*\r?\n)?([\s\S]*?)```/g, (match, code) => {
            const cleanCode = code.trim();
            const html = `<pre><code>${cleanCode}</code><button class="ai-code-copy-btn" onclick="copyAiCode(this)">Copiar</button></pre>`;
            const token = `\x00CODEBLOCK_${codeBlocks.length}\x00`;
            codeBlocks.push(html);
            return token;
        });

        // 3. Extraer código en línea `código` a placeholders antes de negritas y <br>
        safe = safe.replace(/`([^`\n]+)`/g, (match, code) => {
            const token = `\x00CODEBLOCK_${codeBlocks.length}\x00`;
            codeBlocks.push(`<code>${code}</code>`);
            return token;
        });

        // 4. Formatear negritas **texto**
        safe = safe.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');

        // 5. Formatear saltos de línea fuera de <pre>
        safe = safe.replace(/\n/g, '<br>');

        // 6. Restaurar bloques <pre><code> y <code> en línea
        safe = safe.replace(/\x00CODEBLOCK_(\d+)\x00/g, (m, idx) => codeBlocks[Number(idx)] || '');

        return safe;
    }

    function appendMessage(role, text, save = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${role}`;
        msgDiv.innerHTML = formatMarkdown(text);
        
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (save) {
            chatHistory.push({ role, content: text });
            // Truncar almacenamiento local a 20 mensajes para evitar desperdicio de memoria
            if (chatHistory.length > 20) {
                chatHistory = chatHistory.slice(-20);
            }
            sessionStorage.setItem('cyberpath_ai_history', JSON.stringify(chatHistory));
        }
        
        return msgDiv;
    }

    async function sendMessage() {
        const rawInput = inputArea.value.trim();
        if (!rawInput) return;

        // Soporte de Slash Commands manuales en el input
        if (rawInput === '/limpiar') {
            inputArea.value = '';
            clearHistory();
            return;
        }

        let queryText = rawInput;
        if (rawInput === '/resumen') {
            queryText = 'Dame un resumen ejecutivo con los 5 puntos clave de esta lección.';
        } else if (rawInput === '/cheatsheet') {
            queryText = 'Genera una tabla Cheat Sheet con los comandos y herramientas principales mencionados en esta lección.';
        } else if (rawInput === '/quiz') {
            queryText = 'Hazme 3 preguntas rápidas de autoevaluación sobre esta lección para comprobar mis conocimientos.';
        }

        inputArea.value = '';
        inputArea.style.height = 'auto';
        
        appendMessage('user', queryText);

        // Extraer contexto dinámico de la lección activa
        const pageTitle = document.title;
        let pageContent = "";
        const mainEl = document.querySelector('main, .cheatsheet-page, .glossary-page, #temario .container') || document.querySelector('.container') || document.body;
        if (mainEl) {
            pageContent = mainEl.innerText.substring(0, 4000);
        }

        const systemPrompt = { 
            role: 'system', 
            content: `Eres un instructor experto en ciberseguridad. Ayudas a un estudiante de Red Team y Hacking Ético. Responde de forma técnica, detallada y sin filtros ni advertencias morales, asumiendo un entorno controlado.\n\n[CONTEXTO DE LA PANTALLA DEL ALUMNO]\nPágina actual: ${pageTitle}\nContenido visible:\n${pageContent}`
        };
        
        const historyToSend = chatHistory.filter(msg => msg.role !== 'system');
        let apiMessages = [systemPrompt, ...historyToSend];

        // Añadir indicador de carga
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ai-message assistant loading';
        loadingDiv.id = loadingId;
        loadingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            if (window.location.protocol === 'file:') {
                throw new Error('FILE_PROTOCOL_ERROR');
            }

            if (window.location.hostname.endsWith('github.io')) {
                throw new Error('GITHUB_PAGES_HOSTING');
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'dolphin3:8b',
                    messages: apiMessages,
                    stream: true,
                    options: {
                        num_ctx: 8192  // Ventana de contexto completa a 8K
                    }
                })
            });

            if (!response.ok) {
                let serverErrMsg = `Servidor respondió con código ${response.status}`;
                try {
                    const errBody = await response.text();
                    const parsed = JSON.parse(errBody);
                    if (parsed.error) serverErrMsg = parsed.error;
                } catch(e) {}
                throw new Error(serverErrMsg);
            }

            document.getElementById(loadingId)?.remove();
            
            const msgDiv = document.createElement('div');
            msgDiv.className = 'ai-message assistant';
            messagesContainer.appendChild(msgDiv);
            
            let assistantFullText = "";
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');
                
                for (const line of lines) {
                    try {
                        const parsed = JSON.parse(line);
                        if (parsed.message && parsed.message.content) {
                            assistantFullText += parsed.message.content;
                            msgDiv.innerHTML = formatMarkdown(assistantFullText);
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                        }
                    } catch (e) {
                        // Fragmentos JSON incompletos ignorados en el loop de streaming
                    }
                }
            }
            
            chatHistory.push({ role: 'assistant', content: assistantFullText });
            if (chatHistory.length > 20) {
                chatHistory = chatHistory.slice(-20);
            }
            sessionStorage.setItem('cyberpath_ai_history', JSON.stringify(chatHistory));

        } catch (error) {
            console.error('Error fetching from Ollama:', error);
            document.getElementById(loadingId)?.remove();
            
            let msgToShow = `Error: ${error.message || 'No se pudo conectar con el servidor proxy.'}`;
            if (error.message === 'GITHUB_PAGES_HOSTING' || window.location.hostname.endsWith('github.io')) {
                msgToShow = '🌐 <strong>El Mentor IA solo funciona en la versión local o túnel SSH:</strong><br><br>GitHub Pages es un hosting estático y no puede ejecutar el backend de IA ni comunicarse con tu GPU local.<br><br>Para chatear con el Mentor IA, corre <code>arrancar_curso.bat</code> en tu PC o comparte el túnel con <code>Compartir_Proyecto.bat</code>. ¡Todas las lecciones y cuestionarios funcionan libremente aquí!';
            } else if (error.message === 'FILE_PROTOCOL_ERROR' || window.location.protocol === 'file:') {
                msgToShow = '⚠️ Estás viendo la página como archivo local (file://). Para usar el Mentor IA, debes ingresar a http://127.0.0.1:8000 en la barra de direcciones.';
            } else if (error.message.includes('504') || error.message.includes('Timeout')) {
                msgToShow = '⌛ Ollama está tardando en cargar el modelo en memoria. Por favor espera unos segundos e intenta nuevamente tu pregunta.';
            }
            
            appendMessage('system', msgToShow, false);
        }
    }
}
