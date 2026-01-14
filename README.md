# 🎵 Maestra de Música - Plataforma Web Profesional

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-orange?logo=convex)](https://convex.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan?logo=tailwindcss)](https://tailwindcss.com/)

Una plataforma web moderna, elegante y autoadministrable diseñada para la gestión integral de una academia de música personal. Permite la reserva de clases, gestión de contenidos (blog, galería con soporte multimedia), administración de estudiantes y pagos, todo bajo una interfaz premium y responsiva respaldada por **Convex**.

---

## ✨ Características Destacadas

### 🎨 Experiencia de Usuario (Frontend)
- **Diseño Premium**: Interfaz moderna con animaciones fluidas y diseño responsivo.
- **Reserva de Clases**: Sistema interactivo para consultar disponibilidad y agendar lecciones en tiempo real.
- **Contenido Dinámico**:
  - **Blog Educativo**: Artículos formativos con formateo rico.
  - **Galería Multimedia**: Soporte para fotos, videos e integración nativa de **YouTube** e **Instagram**.
  - **Servicios**: Catálogo claro de oferta académica.
- **SEO Avanzado**: Implementación de JSON-LD y meta-etiquetas dinámicas.

### 🛠️ Panel de Administración (CMS)
- **Gestión Total**: Dashboard protegido para administrar todo el negocio.
- **CMS Integrado**: Editor para crear servicios, testimonios, posts y contenido del sitio.
- **Centro de Mensajes**: Bandeja de entrada con capacidad de respuesta directa a estudiantes.
- **Control Financiero**: Registro y seguimiento de pagos.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + TypeScript** | UI robusta y tipada. |
| **Build Tool** | **Vite** | Entorno de desarrollo ultrarrápido. |
| **Estilos** | **Tailwind CSS** | Diseño consistente y responsivo. |
| **Backend** | **Convex** | Backend reactivo en tiempo real (Base de datos + Funciones + Storage). |
| **Auth** | **Convex Auth** | Sistema de autenticación seguro y flexible. |

---

## ⚙️ Instalación y Desarrollo Local

### Prerrequisitos
- Node.js (v18+)
- Cuenta en [Convex](https://convex.dev) (Gratuita)

### 1. Clonar e Instalar
```bash
git clone https://github.com/Miltondz/maestraMusica.git
cd maestraMusica
npm install
```

### 2. Inicializar Convex
```bash
npx convex dev
```
Esto te pedirá iniciar sesión en Convex y creará un nuevo proyecto y despliegue automáticamente.

### 3. Configurar Autenticación (Admin)
Para crear el primer usuario administrador, utiliza el script de setup (solo una vez) o registra el usuario directamente si habilitas el registro público temporalmente, o contacta al administrador del sistema.

### 4. Ejecutar
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 📂 Despliegue en Producción

El proyecto está optimizado para desplegarse fácilmente.

1.  **Frontend**: Vercel, Netlify o cualquier host de estáticos.
    *   Comando de build: `npm run build`
    *   Directorio de salida: `dist`
2.  **Backend**: Convex (gestionado automáticamente).
    *   Asegúrate de configurar las variables de entorno en tu dashboard de Convex (Production).

---

## 🔒 Seguridad y Roles

El sistema utiliza **Convex Auth** y RLS (Row Level Security) mediante lógica en las funciones (`query` y `mutation`) para proteger los datos:
*   **Público**: Lectura de contenido general.
*   **Admin**: Acceso total de escritura y gestión.
