# Maestra de Música - Sitio Web Profesional

Este repositorio contiene el código fuente de un sitio web completo y profesional para una maestra de música, construido con tecnologías modernas para ofrecer una experiencia de usuario excepcional y una gestión de contenido sencilla.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-repo/your-repo-name) <!-- Reemplazar con el enlace real -->

## ✨ Características Principales

- **Diseño Moderno y Adaptable**: Interfaz elegante y totalmente responsive, optimizada para cualquier dispositivo.
- **SEO Optimizado**: Implementación de las mejores prácticas de SEO, incluyendo meta-tags, sitemap, y `robots.txt` para una máxima visibilidad en buscadores.
- **Animaciones y Transiciones Suaves**: Uso de `framer-motion` para animaciones fluidas que mejoran la experiencia de usuario.
- **Panel de Administración Completo**: Área privada para gestionar servicios, testimonios, blog, galería y reservas.
- **Reserva de Clases Dinámica**: Sistema interactivo para que los estudiantes consulten disponibilidad y agenden clases.
- **Exportación de Datos**: Funcionalidad en el panel de administración para exportar datos de citas, mensajes y pagos a formatos PDF y TXT.

## 🚀 Secciones Clave

- **Inicio**: Página de bienvenida con una introducción a los servicios, testimonios y un llamado a la acción claro.
- **Sobre Mí**: Biografía detallada, experiencia y filosofía de enseñanza, presentada con una línea de tiempo interactiva.
- **Servicios**: Listado de clases ofrecidas con descripciones, precios y la opción de reservar directamente.
- **Galería**: Colección de fotos y videos con filtros por categoría y tipo de medio, y un visor de lightbox.
- **Blog**: Artículos educativos con un buscador integrado.
- **Contacto**: Formulario de contacto y detalles de información.
- **Reservar Clase**: Página dedicada para que los estudiantes agenden sus clases.
- **/admin**: Panel de administración para la gestión integral del sitio.

## 🛠️ Stack Tecnológico

### Frontend

- **Framework**: React 18 con TypeScript y Vite.
- **Estilos**: Tailwind CSS para un diseño moderno y personalizable.
- **Animaciones**: Framer Motion para interacciones y animaciones fluidas.
- **Componentes**: Componentes reutilizables y accesibles.
- **Iconos**: Lucide React.
- **Enrutamiento**: React Router.
- **Formularios**: React Hook Form con Zod para validaciones robustas.

### Backend (BaaS)

- **Plataforma**: PocketBase (Auto-hospedado en Railway).
- **Base de Datos**: SQLite (Gestionado por PocketBase).
- **Autenticación**: PocketBase Auth (Email/Password).
- **Almacenamiento**: PocketBase Files.

## ⚙️ Instalación y Despliegue

### Requisitos

- Node.js (v18 o superior)
- npm

### Desarrollo Local

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/your-repo/your-repo-name.git
    cd your-repo-name
    ```
2.  **Instalar dependencias**:
    ```bash
    npm install
    ```
3.  **Configurar PocketBase**:

    - Asegúrate de tener una instancia de PocketBase corriendo (local o remota).
    - Crea un archivo `.env` en la raíz del proyecto:

    ```env
    VITE_POCKETBASE_URL="TU_URL_DE_POCKETBASE"
    # Ejemplo Local: http://127.0.0.1:8090
    # Ejemplo Producción: https://tu-app.up.railway.app
    ```

    - **Importar Esquema**:
      - Accede al panel de administración (`/_/`).
      - Ve a _Settings > Import collections_.
      - Carga el archivo `pb_full_schema.json` incluido en este repositorio.
    - **Crear Usuario Admin Web**:
      - En la colección `users`, crea un nuevo registro con tus credenciales para acceder al CMS.

4.  **Ejecutar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

### Construcción para Producción

```bash
npm run build
```

Esto generará la carpeta `dist` con los archivos estáticos listos para producción.

### Despliegue

El proyecto está listo para ser desplegado en plataformas como Netlify, Vercel o GitHub Pages. Incluye un archivo `public/_redirects` para una configuración sencilla en Netlify.

## 🎨 Mejoras Realizadas

Este proyecto ha sido mejorado con las siguientes características:

- **Mejoras de SEO**:

  - Se ha optimizado el `index.html` con meta-tags para título, descripción y palabras clave.
  - Se han añadido `sitemap.xml` y `robots.txt` para mejorar la indexación.
  - Se ha incorporado texto y atributos `alt` ricos en palabras clave en todo el sitio.

- **Mejoras Visuales y de UX**:

  - Se han añadido animaciones y transiciones en toda la web utilizando `framer-motion`.
  - Se ha mejorado el diseño y el espaciado en todas las páginas para una apariencia más limpia y profesional.
  - Los botones y tarjetas ahora tienen efectos de hover y foco para una mejor interactividad.
  - Se ha implementado un componente `ScrollToTop` que desplaza la vista al inicio de la página en cada navegación.

- **Nuevas Funcionalidades**:
  - **Exportación de Datos**: Se ha añadido la capacidad de exportar datos de citas, mensajes y pagos a PDF o TXT en el panel de administración.
  - **Footer Actualizado**: El pie de página ahora incluye los créditos de DunaTech.
