# Protocolo de Reanudación Automática y Persistencia Multi-Modelo (Anti-429)

Esta regla se inyecta automáticamente en cualquier sesión y ante cualquier cambio de modelo (Claude Opus ↔ Sonnet ↔ Gemini) dentro del workspace CyberPath 2026 (`c:\Users\ROG\ciberseguridad`).

## 1. Activación Inmediata al Reanudar ("continúa", "retoma", "¿en qué nos quedamos?")
Cuando el usuario pida continuar el trabajo o se recupere de un corte de cuota (`RESOURCE_EXHAUSTED` / HTTP 429):
1. **Lectura Quirúrgica de Estado (<400 tokens)**:
   - Leer inmediatamente las primeras **35 líneas** de `PROJECT_STATE.md` (`StartLine: 1, EndLine: 35`).
   - Ejecutar `git status -s; git log -n 5 --oneline` para detectar si hay un lote a medio aplicar en el árbol de trabajo o cuál fue el último lote commiteado.
   - Consultar el último checkpoint en la memoria local de Engram (`engram_memory` con `recall` o `checkpoint`) si el servidor MCP está disponible.
2. **Cero Reconocimiento Ciego**:
   - Queda **PROHIBIDO** leer archivos completos (`index.html`, `styles.css`, `script.js`) o listar recursivamente `lecciones/` al arrancar.
   - Si existen cambios sin commitear en el working tree (`git status -s` no vacío), inspeccionar únicamente `git diff` para retomar desde la línea exacta donde el modelo anterior se detuvo.

## 2. Ejecución Transaccional por Lotes (Blindaje contra Cortes de Cuota)
Para que ningún corte de cuota o cambio de modelo pierda trabajo:
1. Dividir cualquier tarea mediana o grande en **lotes pequeños, atómicos y verificables**.
2. Al terminar cada lote:
   - Verificar las invariantes de `cyberpath-reglas.md`:
     * `git diff quiz.js server.py Arrancar_Curso.bat` debe estar vacío (salvo permiso explícito).
     * 0 enlaces rotos en `index.html` hacia `lecciones/`.
     * `server.py` devuelve `200` en recursos públicos y `403` en rutas internas (`/.git/config`, `/server.py`, `/.agents/`, `/PROJECT_STATE.md`).
     * Quizzes (`quiz.js`) y proxy de chat (`/api/chat` con Ollama) operativos.
   - Realizar **commit atómico** del lote inmediatamente.
   - Actualizar las primeras 35 líneas de `PROJECT_STATE.md` y registrar el checkpoint en Engram reflejando el hash del commit y el siguiente paso exacto.
