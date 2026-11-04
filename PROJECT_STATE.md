# PROJECT_STATE — CyberPath 2026 (`c:\Users\ROG\ciberseguridad`)

## 1. Cápsula Ejecutiva de Reanudación Rápida (Líneas 1–35 | <400 Tokens)
- **Estado Global**: ✅ **HITO COMPLETADO AL 100% (Lotes 1, 2 y 3 verificados y en Git)**.
- **Última Actualización**: 2026-11-04 (Recuperación automática post-429 Opus → Gemini).
- **Lotes Ejecutados y Commits**:
  - `2a844fe` — **Reglas**: Directivas `cyberpath-reglas` en `.agents/rules/` y `.agents/skills/`.
  - `33391bb` — **Lote 1 (`styles.css`)**: Tokens dark mode táctico, `.lesson-item`, `.difficulty`, `.duration-tag`, `.cert-tag`, `.prereq-accordion`, `.career-track`, `.phase-progress`.
  - `909cfd1` — **Lote 2 (`index.html`)**: 3 franjas (`#careerTrack`), 7 fases (`data-phase="0..6"`), 31 `.lesson-item` con `.lesson-card` + `<details class="prereq-accordion">` (51 chips).
  - `3bd5b4a` / `ed3fc0c` — **Lote 3 (`index.html`, `script.js`, `styles.css`)**: Barra segmentada `#phaseProgress` (`F0..F6` con `data-phase` y `data-phase-bar`), sincronización con `CyberQuiz.getProgress()` y badges de `.lesson-card` (`updatePhaseProgress` / `syncLessonCardBadges`), franja activa (`ESTÁS AQUÍ` / `.is-current` / `.is-done`) y retrocompatibilidad con `#courseProgressText`.
- **Archivos Intocables (PROHIBIDO modificar sin permiso explícito)**:
  - `server.py` (proxy a Ollama `127.0.0.1:11434` y whitelist `is_allowed_path`).
  - `quiz.js` (sistema de evaluación y `localStorage['cyberpath_progress']`).
  - `Arrancar_Curso.bat` y nombres existentes en `lecciones/leccion-*.html`.
- **Estado de QA del Lote 3**:
  - Enlaces en `index.html`: **96 totales (85 a `lecciones/`, 31 `.lesson-card`, 51 `.prereq-chip`) — 0 enlaces rotos**.
  - Seguridad `server.py`: `200 OK` en rutas públicas; `403 Forbidden` en `/.git/config`, `/server.py`, `/.agents/`, `/PROJECT_STATE.md`.
  - Mentor IA (`/api/chat` → `dolphin3:8b`) y `CyberQuiz`: **200 OK y 100% operativos**.
- **Siguiente Paso Exacto (Si el usuario dice "continúa" o "retoma")**:
  1. No repetir Lotes 1, 2 ni 3 (ya están commiteados y verificados).
  2. Consultar `git status -s` y `git log -n 5 --oneline`.
  3. Si hay una tarea nueva en curso, leer la sección **"Tarea en Curso / Siguiente Lote"** al final de este archivo y el último checkpoint en Engram (`engram_memory`).

---

## 2. Arquitectura del Temario y Componentes (Referencia Técnica)

### Estructura de Franjas y Fases (`#careerTrack` + `.course-phase`)
| Franja (`data-track`) | Fases (`data-phase`) | Lecciones (`.lesson-card`) | IDs de Lecciones |
| :--- | :--- | :---: | :--- |
| `foundation` | Fase 0 (4) + Fase 1 (4) | **8** | F0: `04, 01, 02, 03` · F1: `05, 06, 07, 07b` |
| `specialization` | Fase 2 (6) + Fase 3 (5) | **11** | F2: `08, 08b, 09, 10, 11, 12` · F3: `13a, 13, 14, 15, 15b` |
| `professional` | Fase 4 (5) + Fase 5 (4) + Fase 6 (3) | **12** | F4: `15c..15g` · F5: `16..19` · F6: `20, 20b, 20c` |
| **Total** | **7 Fases (`0..6`)** | **31** | **31 lecciones + 51 chips de prerrequisitos** |

### Lógica de Progreso (`script.js` → `initPhaseProgress` / `updatePhaseProgress`)
- Invocada en `DOMContentLoaded` dentro de un bloque `try/catch` aislado antes de `initAIChatbot()`, y expuesta en `window.updatePhaseProgress`.
- Lee `CyberQuiz.getProgress()` de forma segura (solo lectura, sin modificar `quiz.js`), normaliza las claves a minúsculas (`leccion-07b`, `leccion-13a`, `leccion-15b..15g`, `leccion-20b`, `leccion-20c`), valida `completed === true` y sincroniza los badges `.completed` / `.lesson-completed-badge` de `.lesson-card` (`syncLessonCardBadges`).
- Actualiza cada `.phase-progress__item[data-phase="0..6"]`:
  - `.phase-progress__count` (`done/total`), `.phase-progress__fill` (`style.width = "${pct}%"`), `aria-valuenow`, `aria-valuemax`, `aria-valuetext` y clase `.is-complete` al llegar a 100%.
  - `#courseProgressText`: `"${doneTotal} / ${lessonTotal} lecciones completadas"`.
- Actualiza `#careerTrack .career-track__step[data-track]`:
  - Marca `.is-done` cuando todas las fases de esa franja están al 100%.
  - Identifica la primera fase incompleta para asignar `.is-current`, `aria-current="step"` y `<span class="career-track__here">ESTÁS AQUÍ</span>` (sin duplicados).
  - Si las 7 fases (31/31 lecciones) están completas, marca las 3 franjas con `.is-done` y mantiene `.is-current` + `ESTÁS AQUÍ` en `Professional`.
- Registra una única vez (`phaseProgressListenersBound`) los listeners de `storage` (`cyberpath_progress`), `pageshow` (`e.persisted`) y hooks de `localStorage` en la misma pestaña para sincronizar entre pestañas, al volver atrás desde BFCache o al actualizar en vivo.

---

## 3. Protocolo de Reanudación Automática Multi-Modelo (Anti-429)

1. **Al iniciar o reanudar sesión ("continúa", "retoma", cambio de modelo Opus ↔ Gemini)**:
   - Leer **únicamente** las líneas 1–35 de `PROJECT_STATE.md` (`view_file` con `StartLine=1, EndLine=35`) y ejecutar `git status -s; git log -n 5 --oneline`.
   - Prohibido realizar escaneos masivos de archivos o releer `index.html` / `styles.css` completos.
2. **Antes y después de cada lote de cambios**:
   - Si un cambio se divide en lotes, actualizar la sección 1 de `PROJECT_STATE.md` y hacer commit atómico inmediatamente después de verificar QA.
   - Si ocurre un corte por cuota (`RESOURCE_EXHAUSTED 429`), cualquier modelo alternativo puede inspeccionar `git diff` y las primeras 35 líneas de `PROJECT_STATE.md` para terminar exactamente el lote interrumpido sin perder contexto.

---

## 4. Tarea en Curso / Siguiente Lote
- **En curso**: Ninguna tarea pendiente. Los Lotes 1, 2 y 3 del rediseño táctico del temario y el sistema de auto-reanudación están 100% completados, probados y commiteados.
- **Disponible para próximas iteraciones**: Nuevas lecciones (usando sufijo de letra según `cyberpath-reglas`), mejoras opcionales en páginas interiores de `lecciones/`, o laboratorios adicionales previa solicitud del autor.
