# CyberPath 2026

Curso completo de ciberseguridad en español: desde cero hasta nivel experto en hacking ético, pentesting, Blue Team, SOC, DFIR y GRC.

🌐 **Enlace oficial permanente (24/7):** [https://gherard-00.github.io/cyberpath-2026/](https://gherard-00.github.io/cyberpath-2026/)

## Qué es este proyecto

CyberPath 2026 es una plataforma educativa construida como sitio estático puro (HTML + CSS + JavaScript vanilla, sin frameworks ni backend pesado). Está dirigida a personas autodidactas y profesionales que buscan formarse desde cero hasta un perfil listo para la industria.

El curso se organiza en **7 fases progresivas** (Fases 0 a 6) articuladas en **3 franjas profesionales** (*Foundation*, *Specialization* y *Professional*), con **31 lecciones**, **2 cheatsheets de referencia**, **glosario técnico** interactivo con buscador, visor de recursos PDF y un **sistema de evaluación interactivo (CyberQuiz)** con persistencia de progreso, evidencias prácticas y Mentor IA (vía Ollama en modo local).

## Estructura del proyecto

```
ciberseguridad/
├── index.html                # Interfaz principal con temario táctico HUD, franjas y progreso
├── styles.css                # Sistema de diseño táctico (dark mode, responsive, print)
├── script.js                 # Interactividad, navegación de fases, progreso y chat Ollama
├── quiz.js                   # Motor de evaluación CyberQuiz (persistente en localStorage)
├── favicon.svg               # Ícono del sitio
├── .gitignore
├── README.md
├── PROJECT_STATE.md
├── docs/                     # Recursos y guías descargables (PDF / DOCX)
└── lecciones/
    │   # Franja 1: Foundation (Fases 0–1 · 8 lecciones)
    ├── leccion-04-laboratorio.html                 # F0: Laboratorio y Virtualización
    ├── leccion-01-redes.html                       # F0: Redes y Modelo OSI/TCP-IP
    ├── leccion-02-linux.html                       # F0: Linux para Hackers
    ├── leccion-03-programacion.html                # F0: Python y Bash Scripting
    ├── leccion-05-seguridad-conceptos.html         # F1: Fundamentos de Ciberseguridad
    ├── leccion-06-criptografia.html                # F1: Criptografía Práctica
    ├── leccion-07-etica-legal.html                 # F1: Marco Legal y Ética
    ├── leccion-07b-grc-fundamentos.html            # F1: GRC, ISO 27001 y Cumplimiento
    │   # Franja 2: Specialization (Fases 2–3 · 11 lecciones)
    ├── leccion-08-nmap.html                        # F2: Escaneo con Nmap
    ├── leccion-08b-web-fundamentals.html           # F2: Arquitectura Web y Protocolos
    ├── leccion-09-web-hacking.html                 # F2: OWASP Top 10 y Web Hacking
    ├── leccion-10-burpsuite.html                   # F2: Interceptación con Burp Suite
    ├── leccion-11-metasploit.html                  # F2: Explotación con Metasploit
    ├── leccion-12-password-cracking.html           # F2: Cracking de Contraseñas
    ├── leccion-13a-windows-ad-fundamentos.html     # F3: Fundamentos Windows y Active Directory
    ├── leccion-13-active-directory.html            # F3: Ataques Avanzados a Directorio Activo
    ├── leccion-14-wifi-hacking.html                # F3: Seguridad Inalámbrica y Wi-Fi
    ├── leccion-15-redteam.html                     # F3: Simulación de Adversarios y Red Team
    ├── leccion-15b-cloud-security.html             # F3: Seguridad Ofensiva en Cloud (AWS)
    │   # Franja 3: Professional (Fases 4–6 · 12 lecciones)
    ├── leccion-15c-soc-fundamentos.html            # F4: Arquitectura y Operaciones SOC
    ├── leccion-15d-siem-logs.html                  # F4: Ingesta y Análisis SIEM
    ├── leccion-15e-deteccion-mitre-sigma.html      # F4: Detección con MITRE ATT&CK y Sigma
    ├── leccion-15f-threat-hunting.html             # F4: Threat Hunting Proactivo
    ├── leccion-15g-respuesta-incidentes.html       # F4: Gestión de Incidentes (NIST SP 800-61)
    ├── leccion-16-forense-intro.html               # F5: Cadena de Custodia y Forense Digital
    ├── leccion-17-volatility.html                  # F5: Forense de Memoria RAM con Volatility
    ├── leccion-18-autopsy.html                     # F5: Análisis de Discos con Autopsy
    ├── leccion-19-wireshark.html                   # F5: Análisis Forense de Red con Wireshark
    ├── leccion-20-reportes.html                    # F6: Redacción de Informes Técnicos y Ejecutivos
    ├── leccion-20b-portafolio-y-certificaciones.html # F6: Certificaciones y Portafolio Profesional
    ├── leccion-20c-proyecto-final.html             # F6: Capstone Project y Carrera Profesional
    │   # Referencia y Recursos
    ├── cheatsheet-linux.html                       # Cheatsheet de Comandos Linux
    ├── cheatsheet-puertos.html                     # Cheatsheet de Puertos y Servicios
    ├── glosario.html                               # Glosario Técnico Interactivo
    └── docs/                                       # Espejo de Recursos PDF
```

## Cómo abrir el curso

### Opción 1 — En la web (GitHub Pages · Recomendado para lectura y quizzes)
Accede directamente desde cualquier navegador y dispositivo:
👉 **[https://gherard-00.github.io/cyberpath-2026/](https://gherard-00.github.io/cyberpath-2026/)**

El 100% del temario (31 lecciones, cuestionarios interactivos, cheatsheets, glosario y descarga de recursos) funciona de manera estática y autónoma sin requerir instalación.

### Opción 2 — En local con Mentor IA (Ollama)
Si deseas interactuar con el Mentor IA táctico impulsado por el modelo local `dolphin3:8b`:

1. Asegúrate de tener instalado [Ollama](https://ollama.ai) y el modelo:
   ```bash
   ollama run dolphin3:8b
   ```
2. Ejecuta en Windows el lanzador automático:
   ```cmd
   Arrancar_Curso.bat
   ```
   O inicia manualmente el servidor Python:
   ```bash
   python server.py
   ```
3. Tu navegador se abrirá en `http://localhost:8000` con el asistente de inteligencia artificial 100% activo en tiempo real.

### Opción 3 — Servidor estático genérico
```bash
# Python 3 estático
python -m http.server 8000

# Node.js
npx -y serve .
```

## Sobre la práctica

Toda la práctica de este curso se realiza en **entornos legales y autorizados**:

- [TryHackMe](https://tryhackme.com) — laboratorios guiados de ciberseguridad
- [CyberDefenders](https://cyberdefenders.org) — retos de forense digital y DFIR
- [flaws.cloud](http://flaws.cloud) / [flaws2.cloud](http://flaws2.cloud) — retos de seguridad en la nube (AWS)
- [DVWA](https://github.com/digininja/DVWA) — aplicación web vulnerable para práctica local

**Nunca practiques técnicas ofensivas en sistemas sin autorización explícita del propietario.** El acceso no autorizado a sistemas informáticos es un delito en la mayoría de jurisdicciones.

## Tecnologías

- HTML5 semántico, CSS3 vanilla (custom properties, Grid, Flexbox, animaciones tácticas HUD)
- JavaScript ES6+ vanilla (IIFE, IntersectionObserver, localStorage, BFCache sync)
- Google Fonts: Inter, Outfit, JetBrains Mono
- Integración opcional de IA local con Ollama (`dolphin3:8b`)
- Sin dependencias externas obligatorias, compatible 100% con GitHub Pages y navegadores modernos
