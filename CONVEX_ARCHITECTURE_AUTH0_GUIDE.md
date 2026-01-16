# Guía de Arquitectura: Convex con Auth0 y Gestión de Archivos

Esta guía explica cómo implementar una arquitectura moderna en Convex, cubriendo el diseño de tablas, la gestión de archivos (buckets) y la integración con un proveedor de identidad externo como Auth0.

---

## 1. Diseño de Tablas (Schema)

En Convex, no usas SQL. Defines tu esquema en TypeScript dentro de `convex/schema.ts`. Esto te da autocompletado y validación automática.

### Ejemplo de diseño:
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tabla de usuarios vinculada a Auth0
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(), // ID único de Auth0 (sub)
    picture: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  // Ejemplo de tabla de productos
  products: defineTable({
    title: v.string(),
    price: v.number(),
    mainImageId: v.optional(v.id("_storage")), // Referencia a un archivo en el bucket
  }),
});
```

---

## 2. Gestión de Archivos (Buckets)

Convex incluye un sistema de almacenamiento de archivos integrado (similar a S3 o Supabase Buckets). No necesitas configurar un servicio externo.

### Cómo funciona:
1. **Generas una URL de subida**: Le pides a Convex una URL temporal.
2. **Subes el archivo**: El frontend hace un `POST` a esa URL.
3. **Guardas la referencia**: Convex te devuelve un `storageId`. Guardas ese ID en tu tabla.

### Ejemplo de función para generar URL:
```typescript
// convex/files.ts
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
```

---

## 3. Integración con Auth0

Para usar Auth0 en lugar de la autenticación nativa de Convex, debes configurar el emisor OIDC.

### Paso 1: Configura `convex/auth.config.ts`
Debes obtener el **Domain** y el **Client ID** de tu dashboard de Auth0.

```typescript
export default {
  providers: [
    {
      domain: "tu-dominio.auth0.com", // Tu dominio de Auth0
      applicationID: "TU_CLIENT_ID",   // El ID de tu aplicación en Auth0
    },
  ],
};
```

### Paso 2: Usar Auth0 en el Frontend
En tu aplicación React, envuelves todo con el `Auth0Provider` de Auth0 y luego usas `ConvexProviderWithAuth0`.

```tsx
import { Auth0Provider } from "@auth0/auth0-react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";

function App() {
  return (
    <Auth0Provider
      domain="tu-dominio.auth0.com"
      clientId="TU_CLIENT_ID"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <ConvexProviderWithAuth0 client={convex}>
        <MaestraMusicaApp />
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}
```

---

## 4. Mejores Prácticas

1. **Relaciones**: Usa `v.id("nombre_tabla")` para crear claves foráneas. Convex garantiza la integridad de estos IDs.
2. **Seguridad**: Siempre verifica el usuario en tus funciones de backend:
   ```typescript
   const identity = await ctx.auth.getUserIdentity();
   if (!identity) throw new Error("No autenticado");
   ```
3. **Índices**: Define índices en `schema.ts` para las columnas por las que vayas a filtrar frecuentemente (`.index("by_name", ["name"])`).

---
*Documentación para el proyecto MaestraMusica - Enero 2026*
