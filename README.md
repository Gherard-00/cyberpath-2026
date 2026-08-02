# CyberPath 2026

Curso completo de ciberseguridad en español: desde cero hasta nivel experto en hacking ético, pentesting y forense digital.

## Qué es este proyecto

CyberPath 2026 es una plataforma educativa construida como sitio estático puro (HTML + CSS + JavaScript vanilla, sin frameworks ni backend). Está dirigida a personas sin experiencia previa que se forman de manera autodidacta.

El curso se organiza en **6 fases progresivas** con **23 lecciones**, **2 cheatsheets de referencia** y un **sistema de evaluación interactivo** con persistencia de progreso.

## Estructura del proyecto

```
ciberseguridad/
├── index.html                # Página principal con temario completo
├── styles.css                # Sistema de diseño (dark mode, responsive, print)
├── script.js                 # Interacciones de la página principal
├── quiz.js                   # Sistema de evaluación (CyberQuiz)
├── favicon.svg               # Ícono del sitio
├── .gitignore
├── README.md
└── lecciones/
    ├── leccion-01-redes.html             # Fase 0: Cimientos
    ├── leccion-02-linux.html
    ├── leccion-03-programacion.html
    ├── leccion-04-laboratorio.html
    ├── leccion-05-seguridad-conceptos.html  # Fase 1: Introducción
    ├── leccion-06-criptografia.html
    ├── leccion-07-etica-legal.html
    ├── leccion-08-nmap.html              # Fase 2: Pentesting
    ├── leccion-08b-web-fundamentals.html
    ├── leccion-09-web-hacking.html
    ├── leccion-10-burpsuite.html
    ├── leccion-11-metasploit.html
    ├── leccion-12-password-cracking.html
    ├── leccion-13a-windows-ad-fundamentos.html  # Fase 3: Red Team
    ├── leccion-13-active-directory.html
    ├── leccion-14-wifi-hacking.html
    ├── leccion-15-redteam.html
    ├── leccion-15b-cloud-security.html
    ├── leccion-16-forense-intro.html     # Fase 4: Forense Digital
    ├── leccion-17-volatility.html
    ├── leccion-18-autopsy.html
    ├── leccion-19-wireshark.html
    ├── leccion-20-reportes.html          # Fase 5: Profesionalización
    ├── glosario.html                     # Glosario interactivo de términos
    ├── cheatsheet-linux.html
    └── cheatsheet-puertos.html
├── docs/                                 # Documentos complementarios (PDF)
```

## Cómo abrir el curso

Este es un sitio estático — no necesita instalación ni compilación.

**Opción 1 — Directa:**
Abre `index.html` en tu navegador.

**Opción 2 — Servidor local (recomendada):**
Un servidor local asegura que las rutas relativas y las fuentes se carguen correctamente:

```bash
# Python 3
python -m http.server 8000

# Node.js (si tienes npx)
npx -y serve .
```

Luego abre `http://localhost:8000` en tu navegador.

## Sobre la práctica

Toda la práctica de este curso se realiza en **entornos legales y autorizados**:

- [TryHackMe](https://tryhackme.com) — laboratorios guiados de ciberseguridad
- [CyberDefenders](https://cyberdefenders.org) — retos de forense digital y DFIR
- [flaws.cloud](http://flaws.cloud) / [flaws2.cloud](http://flaws2.cloud) — retos de seguridad en la nube (AWS)
- [DVWA](https://github.com/digininja/DVWA) — aplicación web vulnerable para práctica local

**Nunca practiques técnicas ofensivas en sistemas sin autorización explícita del propietario.** El acceso no autorizado a sistemas informáticos es un delito en la mayoría de jurisdicciones.

## Tecnologías

- HTML5 semántico, CSS3 vanilla (custom properties, Grid, Flexbox, animaciones)
- JavaScript ES6+ vanilla (IIFE, IntersectionObserver, localStorage)
- Google Fonts: Inter, Outfit, JetBrains Mono
- Sin dependencias externas, sin backend, sin bundlers
