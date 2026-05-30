# 🎵 Maestra de Música - Plataforma Web Profesional

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-Backend-orange?logo=convex)](https://convex.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan?logo=tailwindcss)](https://tailwindcss.com/)

Una plataforma web moderna, elegante y autoadministrable diseñada para la gestión integral de una academia de música personal. Permite la reserva de clases, gestión de contenidos (blog, galería multimedia), administración de estudiantes y pagos, todo bajo una interfaz premium y responsiva respaldada por **Convex**.

---

## ✨ Características Destacadas

### 🎨 Experiencia de Usuario (Frontend)
- **Diseño Premium**: Interfaz moderna con animaciones fluidas y diseño responsivo.
- **Reserva de Clases**: Sistema interactivo con verificación de disponibilidad en tiempo real y protección contra reservas duplicadas.
- **Notificaciones por Email**: Confirmación automática al cliente y notificación al administrador al recibir reservas y mensajes de contacto (vía **Resend**).
- **Contenido Dinámico**:
  - **Blog Educativo**: Artículos formativos con slugs únicos.
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
| **Auth** | **Convex Auth** | Autenticación server-side con email/contraseña. |
| **Email** | **Resend** | Notificaciones transaccionales automáticas. |

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
Esto te pedirá iniciar sesión en Convex y creará un nuevo proyecto y despliegue automáticamente. Copia el valor de `CONVEX_URL` generado.

### 3. Variables de Entorno

Crea un archivo `.env.local` en la raíz:
```env
VITE_CONVEX_URL=<tu URL de Convex>
```

En el **Dashboard de Convex → Settings → Environment Variables**, configura:
```
CONVEX_SITE_URL=<tu URL de Convex>
RESEND_API_KEY=<desde resend.com>
RESEND_FROM_EMAIL=noreply@tudominio.com
ADMIN_EMAIL=admin@tudominio.com
```

> **Nota:** `RESEND_API_KEY` es opcional. Sin él, las notificaciones por email se desactivan silenciosamente sin afectar el funcionamiento.

### 4. Ejecutar
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 📂 Despliegue en Producción

1. **Frontend**: Vercel, Netlify o cualquier host de estáticos.
   - Comando de build: `npm run build`
   - Directorio de salida: `dist`
   - Variable requerida: `VITE_CONVEX_URL`

2. **Backend**: Convex (gestionado automáticamente).
   - Configura las variables de entorno listadas arriba en el dashboard de Convex (entorno Production).

---

## 🔒 Seguridad

- **Autenticación server-side**: Todas las mutations de escritura/administración verifican `ctx.auth.getUserIdentity()` en Convex. La protección no depende únicamente del cliente.
- **Público**: Lectura de servicios, blog, galería, testimonios y disponibilidad de horarios.
- **Admin (requiere sesión)**: Toda escritura — crear, editar, eliminar en cualquier tabla — y acceso a citas, pagos y mensajes.
- **Storage**: La generación de URLs de subida (`generateUploadUrl`) requiere autenticación.
- **Limpieza de archivos**: Al eliminar un item de galería, el archivo en Convex Storage se elimina automáticamente.
