/* ============================================
   CyberPath 2026 — Quiz System
   Evaluación interactiva por lección
   ============================================ */

const CyberQuiz = (() => {
    'use strict';

    const STORAGE_KEY = 'cyberpath_progress';
    const PASS_THRESHOLD = 0.8; // 80% to pass

    // --- State Management ---
    function getProgress() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    function saveProgress(lessonId, score, total) {
        const progress = getProgress();
        progress[lessonId] = {
            completed: true,
            score: `${score}/${total}`,
            date: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }

    function isLessonCompleted(lessonId) {
        const progress = getProgress();
        return progress[lessonId]?.completed === true;
    }

    // --- Quiz Renderer ---
    function initQuiz(lessonId, questions) {
        const container = document.getElementById('quiz-container');
        if (!container) return;

        // Check if already completed
        const alreadyPassed = isLessonCompleted(lessonId);

        // Build quiz HTML
        const totalQ = questions.length;
        const threshold = Math.ceil(totalQ * PASS_THRESHOLD);

        let html = `
            <div class="quiz-header">
                <div class="quiz-header-icon">?</div>
                <div>
                    <h3>Evalúa tu aprendizaje</h3>
                    <p>${totalQ} preguntas · Necesitas ${threshold}/${totalQ} para aprobar</p>
                </div>
            </div>
        `;

        if (alreadyPassed) {
            const progress = getProgress();
            html += `
                <div class="quiz-results visible passed">
                    <div class="quiz-results-icon">&#10003;</div>
                    <h4>¡Lección completada!</h4>
                    <div class="quiz-score">${progress[lessonId].score}</div>
                    <p>Ya aprobaste esta evaluación. Puedes rehacerla si quieres repasar.</p>
                    <button class="quiz-btn quiz-btn-retry" onclick="CyberQuiz.retry('${lessonId}')">Reintentar</button>
                </div>
            `;
            container.innerHTML = html;
            return;
        }

        // Render questions
        questions.forEach((q, idx) => {
            html += `
                <div class="quiz-question" id="q-${idx}" data-correct="${q.correct}">
                    <div class="quiz-question-header">
                        <span class="quiz-question-number">${idx + 1}</span>
                        <span class="quiz-question-text">${q.question}</span>
                    </div>
                    <div class="quiz-options">
            `;
            q.options.forEach((opt, optIdx) => {
                html += `
                    <div class="quiz-option" data-question="${idx}" data-option="${optIdx}" onclick="CyberQuiz.selectOption(this)">
                        <span class="quiz-option-marker">●</span>
                        <span>${opt}</span>
                    </div>
                `;
            });
            html += `
                    </div>
                    <div class="quiz-feedback" id="feedback-${idx}"></div>
                </div>
            `;
        });

        // Submit button + results panel
        html += `
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
            </div>
            <div style="text-align:center; margin-top:1.5rem;">
                <button class="quiz-btn quiz-btn-primary" id="quiz-submit" onclick="CyberQuiz.submit('${lessonId}')">
                    Verificar respuestas
                </button>
            </div>
            <div class="quiz-results" id="quiz-results"></div>
        `;

        container.innerHTML = html;
    }

    // --- Select Option ---
    let answered = {};
    function selectOption(el) {
        const qIdx = el.dataset.question;
        const qContainer = document.getElementById(`q-${qIdx}`);

        // If already answered, don't allow changes
        if (qContainer.classList.contains('answered')) return;

        // Deselect siblings
        qContainer.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Select this one
        el.classList.add('selected');
        answered[qIdx] = parseInt(el.dataset.option);

        // Update progress bar
        updateProgressBar();
    }

    function updateProgressBar() {
        const total = document.querySelectorAll('.quiz-question').length;
        const answeredCount = Object.keys(answered).length;
        const fill = document.getElementById('quiz-progress-fill');
        if (fill) {
            fill.style.width = `${(answeredCount / total) * 100}%`;
        }
    }

    // --- Submit Quiz ---
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
                feedbackEl.innerHTML = `<strong>✓ ¡Correcto!</strong> ${qEl.dataset.explanation || ''}`;
            } else {
                qEl.classList.add('incorrect');
                options[userAnswer].classList.add('wrong-answer');
                options[correctIdx].classList.add('correct-answer');
                feedbackEl.className = 'quiz-feedback visible incorrect';
                feedbackEl.innerHTML = `<strong>✗ Incorrecto.</strong> ${qEl.dataset.explanation || ''}`;
            }
        });

        // Show results
        const passed = score >= Math.ceil(total * PASS_THRESHOLD);
        const resultsEl = document.getElementById('quiz-results');

        if (passed) {
            saveProgress(lessonId, score, total);
            resultsEl.className = 'quiz-results visible passed';
            resultsEl.innerHTML = `
                <div class="quiz-results-icon">&#10003;</div>
                <h4>Lección aprobada</h4>
                <div class="quiz-score">${score}/${total}</div>
                <p>Tu progreso ha sido guardado. Continúa con la siguiente lección.</p>
            `;
        } else {
            resultsEl.className = 'quiz-results visible failed';
            resultsEl.innerHTML = `
                <div class="quiz-results-icon">&#8635;</div>
                <h4>Casi lo logras — repasa e inténtalo de nuevo</h4>
                <div class="quiz-score">${score}/${total}</div>
                <p>Necesitas ${Math.ceil(total * PASS_THRESHOLD)}/${total} para aprobar. Revisa los conceptos marcados en rojo.</p>
                <button class="quiz-btn quiz-btn-retry" onclick="CyberQuiz.retry('${lessonId}')">Reintentar</button>
            `;
        }

        // Hide submit button
        document.getElementById('quiz-submit').style.display = 'none';

        // Scroll to results
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // --- Retry ---
    function retry(lessonId) {
        answered = {};
        // Re-trigger init with the stored questions
        if (window._quizQuestions && window._quizQuestions[lessonId]) {
            initQuiz(lessonId, window._quizQuestions[lessonId]);
        } else {
            location.reload();
        }
    }

    // --- Index Page: Apply Completion Badges ---
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
                    badge.textContent = '✓';
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
