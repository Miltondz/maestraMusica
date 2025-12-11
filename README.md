# 🎵 Maestra de Música - Plataforma Web Profesional

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PocketBase](https://img.shields.io/badge/PocketBase-BaaS-orange?logo=sqlite)](https://pocketbase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan?logo=tailwindcss)](https://tailwindcss.com/)

Una plataforma web moderna, elegante y autoadministrable diseñada para la gestión integral de una academia de música personal. Permite la reserva de clases, gestión de contenidos (blog, galería), administración de estudiantes y pagos, todo bajo una interfaz premium y responsiva.

---

## ✨ Características Destacadas

### 🎨 Experiencia de Usuario (Frontend)
- **Diseño Premium**: Interfaz moderna con animaciones fluidas (`framer-motion`) y diseño responsivo adaptado a todos los dispositivos.
- **Reserva de Clases**: Sistema interactivo para que los estudiantes consulten disponibilidad y agenden lecciones en tiempo real.
- **Contenido Dinámico**:
  - **Blog Educativo**: Artículos formativos con formateo rico y soporte multimedia.
  - **Galería Multimedia**: Soporte para fotos, videos locales, insertos de **YouTube** e **Instagram**.
  - **Servicios y Precios**: Catálogo claro y atractivo de la oferta académica.
- **SEO Avanzado**: Implementación de **JSON-LD (Schema.org)** para Rich Snippets (Escuela de Música, Artículos) y meta-etiquetas dinámicas con `react-helmet-async` para optimización en buscadores e IA.

### 🛠️ Panel de Administración (CMS)
Un dashboard seguro y potente para la gestión total del negocio:
- **Gestión de Citas**: Visualización de calendario, confirmación/cancelación de reservas y seguimiento de estudiantes.
- **Control Financiero**: Registro de pagos, estimación de ingresos y exportación de reportes.
- **CMS Integrado**: Editor completo para crear y editar servicios, testimonios, posts del blog y contenido del sitio sin tocar código.
- **Centro de Mensajes**: Bandeja de entrada para consultas de contacto con estados de lectura/respuesta.

---

## 🚀 Stack Tecnológico

La arquitectura está diseñada para ser rápida, escalable y fácil de mantener.

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + TypeScript** | Lógica robusta y tipado estático para evitar errores. |
| **Build Tool** | **Vite** | Entorno de desarrollo ultrarrápido y construcción optimizada. |
| **Estilos** | **Tailwind CSS** | Diseño utility-first para una UI consistente y ligera. |
| **Backend** | **PocketBase** | BaaS (Backend as a Service) ligero, portable y de alto rendimiento (Go + SQLite). |
| **Despliegue** | **Netlify + Railway** | Frontend en CDN global y Backend en infraestructura escalable. |

---

## ⚙️ Instalación y Desarrollo Local

Sigue estos pasos para levantar el proyecto en tu máquina local.

### Prerrequisitos
- Node.js (v18+)
- Una instancia de PocketBase (Local o Remota)

### 1. Clonar e Instalar
```bash
git clone https://github.com/Miltondz/maestraMusica.git
cd maestraMusica/project
npm install
```

### 2. Configuración de Entorno
Crea un archivo `.env` en la raíz del proyecto (`/project/.env`) basándote en `.env.example`:

```env
VITE_POCKETBASE_URL="TU_URL_DE_POCKETBASE"
# Ejemplo Producción: https://pocketbase-production-xxxx.up.railway.app
# Ejemplo Local: http://127.0.0.1:8090
```

### 3. Configuración de Base de Datos (PocketBase)
Este proyecto incluye el esquema completo de la base de datos para una configuración automática.

1.  Accede a tu panel de administración de PocketBase (ej. `/_/`).
2.  Ve a **Settings > Import collections**.
3.  Carga el archivo **`pb_full_schema.json`** ubicado en la raíz de este repositorio.
4.  Asegúrate de marcar **"Merge"** si ya tienes datos, o limpia la DB antes de importar.

### 4. Ejecutar
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 📂 Estructura del Proyecto

```
project/
├── public/              # Assets estáticos (imágenes, robots.txt, sitemap)
├── src/
│   ├── api/             # Capa de comunicación con PocketBase
│   ├── components/      # Componentes UI reutilizables (Botones, Cards, SEO)
│   ├── hooks/           # Lógica de negocio encapsulada (Custom Hooks)
│   ├── pages/           # Vistas principales (Públicas y Admin)
│   │   └── admin/       # Módulos del Panel de Control
│   ├── services/        # Configuración del cliente PocketBase
│   └── types/           # Definiciones de TypeScript (Interfaces)
└── index.html           # Entrada de la aplicación
```

---

## 🔒 Seguridad y Roles

El sistema implementa **API Rules** de PocketBase para proteger los datos:
*   **Público**: Lectura de Servicios, Blog, Testimonios y Galería.
*   **Privado (Auth)**: Creación de Citas y Mensajes.
*   **Admin/Superuser**: Gestión total de Pagos, Usuarios y Edición de Contenido.

---

## 📄 Licencia

Este proyecto es propiedad de **Maestra Laura Karol** y desarrollado por **DunaTech**. Todos los derechos reservados.
