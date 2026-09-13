---
name: cyberpath-reglas
description: Reglas estrictas y flujo de trabajo innegociable para modificaciones en CyberPath 2026.
---

# Reglas de Proyecto: CyberPath 2026

Estas reglas son absolutas y no negociables. Se deben seguir en cualquier tarea, actualización o corrección del proyecto:

1. **Intocables:** Nunca modificar sin permiso explícito:
   - La lógica de conexión con Ollama en `server.py`
   - La lógica funcional de `quiz.js` relacionada al chat con Ollama y el sistema de evaluación
   - El script de arranque `Arrancar_Curso.bat`
2. **Seguridad del Servidor:** `server.py` **no debe exponer archivos internos del proyecto**. Solamente debe servir los recursos estrictamente necesarios para la aplicación (HTML/CSS/JS base, la carpeta `lecciones/`) y las rutas de API explícitamente autorizadas (como `/api/chat`).
3. **Nomenclatura de Lecciones:** Nunca renombrar archivos de lecciones ya existentes. Toda lección nueva que se inserte en el currículo debe usar un sufijo de letra para no alterar la numeración de los archivos existentes (ejemplo: `07b`, `15c`, `15d`). Nunca se reutiliza ni se cambia un nombre de archivo HTML existente.
4. **Verificación Estricta (QA):** Correr una verificación de enlaces rotos (comparar cada `href="lecciones/*.html"` contra los archivos que realmente existen) después de cada lote de cambios.
5. **Conservadurismo de Código:** Ante la duda, preferir **NO tocar** código que ya funciona antes que intentar "mejorarlo".
6. **Auditoría Respetada:** Si alguna tarea requiere tocar código o contenido ya marcado como "corregido y verificado" en una auditoría o lote previo, **detente y pregunta primero al usuario**.
