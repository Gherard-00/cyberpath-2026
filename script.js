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

    // Metric checkboxes removed — no HTML elements use .metric-item.
    // The CSS (.metric-item, .metric-check) is retained for potential future use.

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

    // --- AI Chatbot Integration (Ollama) ---
    initAIChatbot();

});

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
        let safe = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        // 2. Formatear bloques de código multilínea ```código``` con botón de copiar
        safe = safe.replace(/```([\s\S]*?)```/g, (match, code) => {
            const cleanCode = code.trim();
            return `<pre><code>${cleanCode}</code><button class="ai-code-copy-btn" onclick="copyAiCode(this)">Copiar</button></pre>`;
        });

        // 3. Formatear código en línea `código`
        safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 4. Formatear negritas **texto**
        safe = safe.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');

        // 5. Formatear saltos de línea
        safe = safe.replace(/\n/g, '<br>');

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
        const mainEl = document.querySelector('main') || document.querySelector('.container') || document.body;
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
                    model: 'dolphin-llama3:8b',
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
