# Guía de Resolución: Errores de Autenticación (JWT/PKCS#8)

Este documento explica los errores técnicos encontrados en el sistema de autenticación de Convex y cómo se solucionaron para evitar que ocurran nuevamente en el futuro.

## 1. El Problema
Se reportaron dos errores principales al intentar iniciar sesión:
- **Error 1**: `Uncaught TypeError: "pkcs8" must be PKCS#8 formatted string`.
- **Error 2**: `Uncaught DataError: invalid RSA PrivateKeyInfo`.
- **Síntoma**: La web se quedaba esperando ("cuelgue") y el móvil mostraba errores de servidor.

## 2. Causas Identificadas

### A. Mal formato de la clave en Windows
Al configurar la variable de entorno `JWT_PRIVATE_KEY` mediante la línea de comandos en Windows, los saltos de línea del archivo `private.pem` se estaban convirtiendo en texto literal (`\n`). 
Convex espera una clave con saltos de línea reales. Si recibe `\n` como texto, el validador de PKCS#8 falla.

### B. Conflicto con variable JWKS estática
Existía una variable de entorno llamada `JWKS` en el panel de Convex que contenía una clave pública antigua y estática. 
Incluso después de actualizar la clave privada (`JWT_PRIVATE_KEY`), Convex seguía usando la clave pública de la variable `JWKS` para validar los tokens, lo que causaba un fallo en la firma (Invalid Signature).

## 3. Solución Aplicada

### Paso 1: Configuración Limpia de la Clave Privada
Se utilizó un script de Node.js para enviar el contenido del archivo `private.pem` directamente al flujo de entrada (**stdin**) de la CLI de Convex. Esto evita que la terminal de Windows interfiera con el formato de los caracteres.

### Paso 2: Eliminación de la variable JWKS
Se eliminó la variable `JWKS` de las variables de entorno de Convex. Al hacer esto, Convex **deriva automáticamente** la clave pública de la `JWT_PRIVATE_KEY` actual, asegurando que siempre estén sincronizadas.

## 4. Cómo actualizar en el futuro (o en Producción)

Si necesitas rotar las claves o configurar Producción (Netlify), sigue estas reglas:

1. **Usa stdin para subir la clave**:
   Si estás en Windows, no copies y pegues directamente en la terminal. Usa un comando que lea el archivo:
   ```powershell
   # Ejemplo en PowerShell para Producción
   $key = Get-Content private.pem -Raw; npx.cmd convex env set JWT_PRIVATE_KEY --prod -- "$key"
   ```

2. **Verifica las variables**:
   Asegúrate de que **NO** exista la variable `JWKS` en el panel de Convex, a menos que estés usando un proveedor externo (Auth0, etc.). Para el sistema nativo de contraseñas, Convex la genera solo.

3. **Reinicio de Servicios**:
   Siempre que cambies una variable de entorno en Convex, debes reiniciar el servidor local (`npx convex dev`) para que los cambios se propaguen al frontend.

---
*Documentación generada tras la reparación del sistema de autenticación - Enero 2026*
