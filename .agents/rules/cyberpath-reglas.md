# Reglas del proyecto CyberPath 2026

## Nunca tocar sin permiso explícito del autor
- La lógica de conexión con Ollama en server.py
- La lógica funcional de quiz.js relacionada al chat
- Arrancar_Curso.bat

## Exposición de archivos
server.py no debe exponer archivos internos del proyecto; solamente debe servir los recursos
necesarios para la aplicación y las rutas de API explícitamente autorizadas.

## Nombres de archivo
Nunca renombrar lecciones existentes. Toda lección nueva usa sufijo de letra (07b, 15c,
15d...), nunca se reutiliza ni se cambia un nombre de archivo existente.

## Flujo obligatorio
1. Confirma que hay un commit reciente del estado actual antes de empezar.
2. Haz cambios en lotes pequeños y verificables.
3. Después de cada lote: verifica que el sitio cargue, que el chat de Ollama responda, que
   los quizzes funcionen, y que no haya enlaces rotos (comparar cada href de lección contra
   los archivos que realmente existen).
4. Haz commit de cada lote exitoso antes de continuar con el siguiente.

## Ante la duda
Preferir NO tocar código que ya funciona antes que "mejorarlo" si no es estrictamente
necesario para el objetivo pedido. Si algo requiere tocar código ya marcado como "corregido y
verificado" en una auditoría previa, detente y pregunta al autor primero.
