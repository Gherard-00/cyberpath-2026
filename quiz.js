/* ============================================
   CyberPath 2026 — Quiz System
   Evaluación interactiva por lección
   ============================================ */

const CyberQuiz = (() => {
    'use strict';

    /** @constant {string} Clave de localStorage para el progreso del usuario */
    const STORAGE_KEY = 'cyberpath_progress';

    /** @constant {number} Umbral de aprobación (80%) */
    const PASS_THRESHOLD = 0.8;

    // --- State Management ---

    /**
     * Obtiene el progreso guardado del usuario desde localStorage.
     * @returns {Object} Objeto con el progreso por lección, o un objeto vacío si no hay datos.
     */
    function getProgress() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    /**
     * Guarda el resultado de una lección completada en localStorage.
     * @param {string} lessonId - Identificador de la lección (ej: "leccion-01").
     * @param {number} score - Cantidad de respuestas correctas.
     * @param {number} total - Cantidad total de preguntas.
     */
    function saveProgress(lessonId, score, total) {
        const progress = getProgress();
        progress[lessonId] = {
            completed: true,
            score: `${score}/${total}`,
            date: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }

    /**
     * Verifica si una lección ya fue aprobada.
     * @param {string} lessonId - Identificador de la lección.
     * @returns {boolean} true si la lección está marcada como completada.
     */
    function isLessonCompleted(lessonId) {
        const progress = getProgress();
        return progress[lessonId]?.completed === true;
    }

    // --- DOM Helpers ---

    /**
     * Crea un elemento HTML con atributos y contenido opcionales.
     * @param {string} tag - Nombre de la etiqueta HTML.
     * @param {Object} [attrs] - Atributos del elemento (clase, id, dataset, etc.).
     * @param {string} [text] - Contenido de texto del elemento.
     * @returns {HTMLElement} El elemento creado.
     */
    function el(tag, attrs, text) {
        const node = document.createElement(tag);
        if (attrs) {
            for (const [key, val] of Object.entries(attrs)) {
                if (key === 'className') {
                    node.className = val;
                } else if (key === 'dataset') {
                    for (const [dk, dv] of Object.entries(val)) {
                        node.dataset[dk] = dv;
                    }
                } else if (key.startsWith('aria')) {
                    node.setAttribute(key.replace(/([A-Z])/g, '-$1').toLowerCase(), val);
                } else {
                    node.setAttribute(key, val);
                }
            }
        }
        if (text !== undefined) {
            node.textContent = text;
        }
        return node;
    }

    /**
     * Agrega uno o varios hijos a un nodo padre.
     * @param {HTMLElement} parent - El nodo padre.
     * @param {...HTMLElement} children - Los nodos hijos a agregar.
     * @returns {HTMLElement} El nodo padre (para encadenamiento).
     */
    function append(parent, ...children) {
        children.forEach(c => parent.appendChild(c));
        return parent;
    }

    // --- Quiz Renderer ---

    /** @type {Object<string, number>} Respuestas del usuario indexadas por número de pregunta */
    let answered = {};

    /**
     * Inicializa y renderiza el quiz en el contenedor #quiz-container.
     * Guarda las preguntas en window._quizQuestions para la funcionalidad de retry.
     * @param {string} lessonId - Identificador de la lección.
     * @param {Array<{question: string, options: string[], correct: number}>} questions - Preguntas del quiz.
     */
    function initQuiz(lessonId, questions) {
        const container = document.getElementById('quiz-container');
        if (!container) return;

        // Store questions for retry
        window._quizQuestions = window._quizQuestions || {};
        window._quizQuestions[lessonId] = questions;

        // Reset answered state
        answered = {};

        // Clear container
        container.textContent = '';

        const alreadyPassed = isLessonCompleted(lessonId);
        const totalQ = questions.length;
        const threshold = Math.ceil(totalQ * PASS_THRESHOLD);

        // --- Quiz Header ---
        const header = el('div', { className: 'quiz-header' });
        const headerIcon = el('div', { className: 'quiz-header-icon' }, '?');
        const headerInfo = el('div');
        append(headerInfo,
            el('h3', {}, 'Evalúa tu aprendizaje'),
            el('p', {}, `${totalQ} preguntas \u00b7 Necesitas ${threshold}/${totalQ} para aprobar`)
        );
        append(header, headerIcon, headerInfo);
        container.appendChild(header);

        // --- Already Passed State ---
        if (alreadyPassed) {
            const progress = getProgress();
            const results = el('div', { className: 'quiz-results visible passed' });
            const retryBtn = el('button', { className: 'quiz-btn quiz-btn-retry' }, 'Reintentar');
            retryBtn.addEventListener('click', () => { retry(lessonId); });

            append(results,
                el('div', { className: 'quiz-results-icon' }, '\u2713'),
                el('h4', {}, 'Leccion completada'),
                el('div', { className: 'quiz-score' }, progress[lessonId].score),
                el('p', {}, 'Ya aprobaste esta evaluacion. Puedes rehacerla si quieres repasar.'),
                retryBtn
            );
            container.appendChild(results);
            return;
        }

        // --- Render Questions ---
        questions.forEach((q, idx) => {
            const qDiv = el('div', {
                className: 'quiz-question',
                id: `q-${idx}`,
                dataset: { correct: String(q.correct) }
            });

            // Question header
            const qHeader = el('div', { className: 'quiz-question-header' });
            append(qHeader,
                el('span', { className: 'quiz-question-number' }, String(idx + 1)),
                el('span', { className: 'quiz-question-text' }, q.question)
            );
            qDiv.appendChild(qHeader);

            // Options container with ARIA radiogroup
            const optionsDiv = el('div', {
                className: 'quiz-options',
                role: 'radiogroup',
                ariaLabel: `Opciones para la pregunta ${idx + 1}`
            });

            q.options.forEach((opt, optIdx) => {
                const optDiv = el('div', {
                    className: 'quiz-option',
                    role: 'radio',
                    tabindex: '0',
                    ariaChecked: 'false',
                    dataset: { question: String(idx), option: String(optIdx) }
                });

                optDiv.addEventListener('click', () => { selectOption(optDiv); });
                optDiv.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectOption(optDiv);
                    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        const next = optDiv.nextElementSibling;
                        if (next) next.focus();
                    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        const prev = optDiv.previousElementSibling;
                        if (prev) prev.focus();
                    }
                });

                append(optDiv,
                    el('span', { className: 'quiz-option-marker' }, '\u25cf'),
                    el('span', {}, opt)
                );
                optionsDiv.appendChild(optDiv);
            });

            qDiv.appendChild(optionsDiv);

            // Feedback container
            qDiv.appendChild(el('div', { className: 'quiz-feedback', id: `feedback-${idx}` }));

            container.appendChild(qDiv);
        });

        // --- Progress Bar ---
        const progressBar = el('div', { className: 'quiz-progress-bar' });
        progressBar.appendChild(el('div', { className: 'quiz-progress-fill', id: 'quiz-progress-fill' }));
        container.appendChild(progressBar);

        // --- Submit Button ---
        const submitWrap = el('div', { style: 'text-align:center; margin-top:1.5rem;' });
        const submitBtn = el('button', {
            className: 'quiz-btn quiz-btn-primary',
            id: 'quiz-submit'
        }, 'Verificar respuestas');
        submitBtn.addEventListener('click', () => { submit(lessonId); });
        submitWrap.appendChild(submitBtn);
        container.appendChild(submitWrap);

        // --- Results Panel (empty, populated on submit) ---
        container.appendChild(el('div', { className: 'quiz-results', id: 'quiz-results' }));
    }

    // --- Select Option ---

    /**
     * Selecciona una opción del quiz. Actualiza clases CSS, ARIA, y la barra de progreso.
     * @param {HTMLElement} optionEl - El elemento de opción clickeado.
     */
    function selectOption(optionEl) {
        const qIdx = optionEl.dataset.question;
        const qContainer = document.getElementById(`q-${qIdx}`);

        // If already answered (after submit), don't allow changes
        if (qContainer.classList.contains('answered')) return;

        // Deselect siblings
        qContainer.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
            opt.setAttribute('aria-checked', 'false');
        });

        // Select this one
        optionEl.classList.add('selected');
        optionEl.setAttribute('aria-checked', 'true');
        answered[qIdx] = parseInt(optionEl.dataset.option);

        // Update progress bar
        updateProgressBar();
    }

    /**
     * Actualiza la barra de progreso visual del quiz.
     */
    function updateProgressBar() {
        const total = document.querySelectorAll('.quiz-question').length;
        const answeredCount = Object.keys(answered).length;
        const fill = document.getElementById('quiz-progress-fill');
        if (fill) {
            fill.style.width = `${(answeredCount / total) * 100}%`;
        }
    }

    // --- Submit Quiz ---

    /**
     * Evalúa todas las respuestas, muestra feedback por pregunta y el resultado final.
     * Si el usuario aprueba (>= 80%), guarda el progreso en localStorage.
     * @param {string} lessonId - Identificador de la lección.
     */
    function submit(lessonId) {
        const questions = document.querySelectorAll('.quiz-question');
        const total = questions.length;
        let score = 0;

        // Check if all questions answered
        if (Object.keys(answered).length < total) {
            const submitBtn = document.getElementById('quiz-submit');
            submitBtn.textContent = 'Responde todas las preguntas primero';
            submitBtn.style.background = 'var(--accent-orange-dim)';
            submitBtn.style.color = 'var(--accent-orange)';
            submitBtn.style.border = '1px solid rgba(255,171,64,0.3)';
            setTimeout(() => {
                submitBtn.textContent = 'Verificar respuestas';
                submitBtn.style.background = '';
                submitBtn.style.color = '';
                submitBtn.style.border = '';
            }, 2000);
            return;
        }

        // Grade each question
        questions.forEach((qEl, idx) => {
            const correctIdx = parseInt(qEl.dataset.correct);
            const userAnswer = answered[idx];
            const isCorrect = userAnswer === correctIdx;
            const feedbackEl = document.getElementById(`feedback-${idx}`);
            const options = qEl.querySelectorAll('.quiz-option');

            qEl.classList.add('answered');

            if (isCorrect) {
                score++;
                qEl.classList.add('correct');
                options[userAnswer].classList.add('correct-answer');
                feedbackEl.className = 'quiz-feedback visible correct';

                const strong = el('strong', {}, '\u2713 Correcto!');
                feedbackEl.textContent = '';
                feedbackEl.appendChild(strong);
                if (qEl.dataset.explanation) {
                    feedbackEl.appendChild(document.createTextNode(' ' + qEl.dataset.explanation));
                }
            } else {
                qEl.classList.add('incorrect');
                options[userAnswer].classList.add('wrong-answer');
                options[correctIdx].classList.add('correct-answer');
                feedbackEl.className = 'quiz-feedback visible incorrect';

                const strong = el('strong', {}, '\u2717 Incorrecto.');
                feedbackEl.textContent = '';
                feedbackEl.appendChild(strong);
                if (qEl.dataset.explanation) {
                    feedbackEl.appendChild(document.createTextNode(' ' + qEl.dataset.explanation));
                }
            }
        });

        // Show results
        const passed = score >= Math.ceil(total * PASS_THRESHOLD);
        const resultsEl = document.getElementById('quiz-results');
        resultsEl.textContent = '';

        if (passed) {
            saveProgress(lessonId, score, total);
            resultsEl.className = 'quiz-results visible passed';
            append(resultsEl,
                el('div', { className: 'quiz-results-icon' }, '\u2713'),
                el('h4', {}, 'Leccion aprobada'),
                el('div', { className: 'quiz-score' }, `${score}/${total}`),
                el('p', {}, 'Tu progreso ha sido guardado. Continua con la siguiente leccion.')
            );
        } else {
            resultsEl.className = 'quiz-results visible failed';
            const retryBtn = el('button', { className: 'quiz-btn quiz-btn-retry' }, 'Reintentar');
            retryBtn.addEventListener('click', () => { retry(lessonId); });
            append(resultsEl,
                el('div', { className: 'quiz-results-icon' }, '\u21bb'),
                el('h4', {}, 'Casi lo logras \u2014 repasa e intentalo de nuevo'),
                el('div', { className: 'quiz-score' }, `${score}/${total}`),
                el('p', {}, `Necesitas ${Math.ceil(total * PASS_THRESHOLD)}/${total} para aprobar. Revisa los conceptos marcados en rojo.`),
                retryBtn
            );
        }

        // Hide submit button
        document.getElementById('quiz-submit').style.display = 'none';

        // Scroll to results
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // --- Retry ---

    /**
     * Reinicia el quiz de una lección. Usa las preguntas almacenadas en window._quizQuestions.
     * @param {string} lessonId - Identificador de la lección.
     */
    function retry(lessonId) {
        answered = {};
        if (window._quizQuestions && window._quizQuestions[lessonId]) {
            initQuiz(lessonId, window._quizQuestions[lessonId]);
        }
        // No fallback to location.reload() — questions are always stored on init
    }

    // --- Index Page: Apply Completion Badges ---

    /**
     * Aplica badges de completado a las tarjetas de lección en index.html.
     * Lee el progreso de localStorage y agrega la clase .completed y un badge visual.
     */
    function applyBadges() {
        const progress = getProgress();
        const lessonCards = document.querySelectorAll('.lesson-card');

        lessonCards.forEach(card => {
            const href = card.getAttribute('href');
            if (!href) return;

            // Extract lesson ID from href: "lecciones/leccion-01-redes.html" → "leccion-01"
            const match = href.match(/leccion-(\d{2}[a-z]?)/);
            if (!match) return;

            const lessonId = `leccion-${match[1]}`;

            if (progress[lessonId]?.completed) {
                card.classList.add('completed');
                const numberEl = card.querySelector('.lesson-number');
                if (numberEl && !numberEl.querySelector('.lesson-completed-badge')) {
                    numberEl.style.position = 'relative';
                    const badge = document.createElement('span');
                    badge.className = 'lesson-completed-badge';
                    badge.textContent = '\u2713';
                    numberEl.appendChild(badge);
                }
            }
        });
    }

    // Auto-apply badges if on index page
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.lessons-list')) {
            applyBadges();
        }
    });

    // --- Public API ---
    return {
        init: initQuiz,
        selectOption,
        submit,
        retry,
        getProgress,
        isLessonCompleted,
        applyBadges
    };
})();

// Store questions globally for retry functionality
window._quizQuestions = window._quizQuestions || {};
