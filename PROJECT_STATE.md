# PROJECT_STATE — CyberPath 2026 (`c:\Users\ROG\ciberseguridad`)

## 1. Cápsula Ejecutiva de Reanudación Rápida (Líneas 1–35 | <400 Tokens)
- **Estado Global**: ✅ **100% COMPLETADO, AUDITADO Y EN VIVO EN GITHUB PAGES — Lotes 1, 2, 3 y 4 (4A-4D) desplegados y sincronizados en origin/master, 0 enlaces rotos (397 enlaces en 35 páginas), 31/31 quizzes operativos y verificación E2E headless en vivo aprobada**.
- **Última Actualización**: 2026-11-04 (Despliegue GitHub Pages exitoso, verificación headless CDP en vivo y sincronización de documentación).
- **Lotes Ejecutados y Commits**:
  - `2a844fe` — **Reglas**: Directivas `cyberpath-reglas` en `.agents/rules/` y `.agents/skills/`.
  - `33391bb` — **Lote 1 (`styles.css`)**: Tokens dark mode táctico, `.lesson-item`, `.difficulty`, `.duration-tag`, `.cert-tag`, `.prereq-accordion`, `.career-track`, `.phase-progress`.
  - `909cfd1` — **Lote 2 (`index.html`)**: 3 franjas (`#careerTrack`), 7 fases (`id="phase-0..6"`, `data-phase="0..6"`), 31 `.lesson-item` con `.lesson-card` + `<details class="prereq-accordion">` (51 chips).
  - `3bd5b4a` / `13ced11` / `ed3fc0c` / `d46c96b` — **Lote 3 + Auto-Resume**: Barra segmentada `#phaseProgress` (`F0..F6`), sincronización BFCache/storage con `CyberQuiz.getProgress()` y protocolo de auto-reanudación.
  - `7628fef` — **Lote 4A (`styles.css`, `cheatsheet-*.html`)**: Variables `--bg-tertiary` y `--text-color`, unificación de `.lesson-card.completed`, `.phase-marker` con `--phase-track-color`, `.lesson-phase-badge.phase-6`, estilos `.lesson-callout`, eliminación total de residuos violeta/rosa, `@media print` y `prefers-reduced-motion`.
  - `d221c6d` — **Lote 4B (`index.html`, `script.js`, `lecciones/docs/`)**: Enlace `#recursos` en `#navLinks`, `data-suffix="+"` en Herramientas, PDFs servidos desde `lecciones/docs/` (HTTP 200), preservación global de `evidenceData` en `localStorage.setItem`, restauración de `data-explanation` con `MutationObserver` tras `CyberQuiz.retry`, `#scrollProgress` en páginas interiores y fix de bloques `<pre><code>` en `formatMarkdown`.
  - `60f18b9` — **Lote 4C (`lecciones/leccion-*.html`)**: Quizzes interactivos de 3 preguntas con `explanations` en Fase 4 (`15c..15g`) habilitando el `31 / 31` y unificación de `'cyberpath_progress'` en las 10 lecciones con Evidencia Práctica.
  - `929de2d` — **Lote 4D / QA Fixes (`script.js`, `lecciones/leccion-*.html`)**: Reintento funcional en lecciones ya aprobadas sin tocar `quiz.js`, blindaje de código en línea (`**kwargs`) en `formatMarkdown`, JSON estricto en `explanations` de `leccion-07b`, eliminación de `#b388ff` inline en `leccion-08b` y enlace `#evaluacion` en TOC de `15c..15f`.
  - `755a16f` — **Docs**: Actualizar PROJECT_STATE.md con cierre de auditoría QA.
  - `8ce92c4` — **Docs**: Sincronizar temario de 7 fases, 3 franjas y opciones de despliegue en `README.md`.
- **Archivos Intocables Verificados (`git diff` vacío)**:
  - `server.py`, `quiz.js`, `Arrancar_Curso.bat` y nombres de archivos existentes en `lecciones/leccion-*.html`.
- **Siguiente Paso Exacto**:
  - Proyecto 100% desplegado, auditado y operativo en vivo en GitHub Pages (`https://gherard-00.github.io/cyberpath-2026/`). Disponible para nuevas iteraciones o requerimientos del autor.

---

## 2. Arquitectura del Temario y Componentes (Referencia Técnica)

### Estructura de Franjas y Fases (`#careerTrack` + `.course-phase`)
| Franja (`data-track`) | Fases (`data-phase` / `id`) | Lecciones (`.lesson-card`) | IDs de Lecciones |
| :--- | :--- | :---: | :--- |
| `foundation` | Fase 0 (`#phase-0`, 4) + Fase 1 (`#phase-1`, 4) | **8** | F0: `04, 01, 02, 03` · F1: `05, 06, 07, 07b` |
| `specialization` | Fase 2 (`#phase-2`, 6) + Fase 3 (`#phase-3`, 5) | **11** | F2: `08, 08b, 09, 10, 11, 12` · F3: `13a, 13, 14, 15, 15b` |
| `professional` | Fase 4 (`#phase-4`, 5) + Fase 5 (`#phase-5`, 4) + Fase 6 (`#phase-6`, 3) | **12** | F4: `15c..15g` · F5: `16..19` · F6: `20, 20b, 20c` |
| **Total** | **7 Fases (`0..6`)** | **31** | **31 lecciones + 51 chips de prerrequisitos** |

### Lógica de Progreso e Interactividad (`script.js` → `initPhaseProgress` / `updatePhaseProgress` / `bindPhaseNavigation`)
- Invocada en `DOMContentLoaded` dentro de un bloque `try/catch` aislado antes de `initAIChatbot()`, y expuesta en `window.updatePhaseProgress`.
- Lee `CyberQuiz.getProgress()` de forma segura (solo lectura, sin modificar `quiz.js`), normaliza las claves a minúsculas (`leccion-07b`, `leccion-13a`, `leccion-15b..15g`, `leccion-20b`, `leccion-20c`), valida `completed === true` y sincroniza los badges `.completed` / `.lesson-completed-badge` de `.lesson-card` (`syncLessonCardBadges`).
- Actualiza cada `.phase-progress__item[data-phase="0..6"]`:
  - `.phase-progress__count` (`done/total`), `.phase-progress__fill` (`style.width = "${pct}%"`), `aria-valuenow`, `aria-valuemax`, `aria-valuetext` y clase `.is-complete` al llegar a 100%.
  - `#courseProgressText`: `"${doneTotal} / ${lessonTotal} lecciones completadas"`.
- Actualiza `#careerTrack .career-track__step[data-track]`:
  - Marca `.is-done` cuando todas las fases de esa franja están al 100%.
  - Identifica la primera fase incompleta para asignar `.is-current`, `aria-current="step"` y `<span class="career-track__here">ESTÁS AQUÍ</span>` (sin duplicados).
  - Si las 7 fases (31/31 lecciones) están completas, marca las 3 franjas con `.is-done` y mantiene `.is-current` + `ESTÁS AQUÍ` en `Professional`.
- **Navegación Interactiva (`bindPhaseNavigation`)**:
  - Cada `.phase-progress__item` (`F0..F6`) y cada `.career-track__step` (`Foundation`, `Specialization`, `Professional`) cuenta con `tabindex="0"`, `aria-controls="phase-X"`, `cursor: pointer` y soporte para clic y teclado (`Enter` / `Space`).
  - Al activarse, realiza scroll suave (`scrollIntoView`, respetando `prefers-reduced-motion`) hacia la fase o primera fase de la franja correspondiente y aplica `.is-selected` + `.is-highlighted` durante 1.8 s con realce táctico HUD.
- Registra una única vez (`phaseProgressListenersBound`) los listeners de `storage` (`cyberpath_progress`), `pageshow` (`e.persisted`) y hooks de `localStorage` en la misma pestaña.

---

## 3. Protocolo de Reanudación Automática y Orquestación Multi-Subagente (Anti-429)

1. **Al iniciar o reanudar sesión ("continúa", "retoma", cambio de modelo Opus ↔ Gemini)**:
   - Leer **únicamente** las líneas 1–35 de `PROJECT_STATE.md` (`view_file` con `StartLine=1, EndLine=35`) y ejecutar `git status -s; git log -n 5 --oneline`.
   - Prohibido realizar escaneos masivos de archivos o releer `index.html` / `styles.css` completos.
2. **Orquestación Autónoma sin Pedir Cambio de Modelo**:
   - Queda prohibido pedir al usuario que cambie de modelo manualmente al finalizar un lote. El agente principal debe coordinar subagentes especializados para diseño, implementación, integración y auditoría QA hasta dejar cada entrega 100% commiteada.

---

## 4. Tarea en Curso / Siguiente Lote
- **En curso**: Ninguna tarea pendiente. Los Lotes 1, 2, 3, el pulido táctico HUD anti-clichés de IA, la interactividad de `#careerTrack` y `#phaseProgress`, y el protocolo de orquestación autónoma están 100% completados, probados y commiteados.
- **Disponible para próximas iteraciones**: Nuevas lecciones (usando sufijo de letra según `cyberpath-reglas`), mejoras opcionales en páginas interiores de `lecciones/`, o laboratorios adicionales previa solicitud del autor.
