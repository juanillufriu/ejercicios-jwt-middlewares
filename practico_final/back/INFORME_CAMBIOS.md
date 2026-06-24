# Informe de Modificaciones

## Ejercicio 1 — Categories
### Título de Modificación
Implementación del módulo Categories.

### Descripción de Modificación
Se creó un módulo completo de categorías con controller, service, repository e interface.

### Código Modificado
- src/categories/categories.module.ts
- src/categories/controllers/categories.controller.ts
- src/categories/services/categories.service.ts
- src/categories/repositories/categories.repository.ts
- src/categories/interfaces/category.interface.ts

### Justificación de Modificación
Se desacopló la lógica siguiendo el patrón controller → service → repository.

## Ejercicio 2 — Paginación
### Título de Modificación
Paginación reutilizable.

### Descripción de Modificación
Se agregó soporte para page y limit.

### Código Modificado
- src/common/paginated-result.ts
- src/products/services/products.service.ts

### Justificación de Modificación
Permite respuestas escalables y consistentes.

## Ejercicio 3 — Persistencia
### Título de Modificación
Preparación para repositorio desacoplado.

### Descripción de Modificación
Se mantuvo la abstracción del repositorio para permitir reemplazo futuro por TypeORM.

### Código Modificado
- src/products/repositories/products.repository.ts

### Justificación de Modificación
El service y el controller quedaron desacoplados de la fuente de datos.

## Ejercicio 4 — Validaciones
### Título de Modificación
Validaciones con class-validator.

### Descripción de Modificación
Se implementaron DTOs y ValidationPipe global.

### Código Modificado
- src/products/dto/create-product.input.ts
- src/products/dto/update-product.input.ts
- src/main.ts

### Justificación de Modificación
Se evita el ingreso de datos inválidos.

## Ejercicio 5 — Gateway alternativo
### Título de Modificación
Gateway local para usuarios.

### Descripción de Modificación
Se agregó LocalUsersGateway con selección mediante variable de entorno.

### Código Modificado
- src/users/gateways/local-users.gateway.ts
- src/users/data/users.json
- src/users/users.module.ts

### Justificación de Modificación
Se permite cambiar la fuente de datos sin modificar controller ni service.

## Práctico Final 1.1 — Verificación de email (Backend)
### Título de Modificación
Flujo completo de verificación de email vía Resend.

### Descripción de Modificación
Se agregaron los campos `isVerified` y `verificationToken` a `UserEntity`. El endpoint `POST /auth/register` ahora genera un token con `crypto.randomUUID()`, lo guarda y envía un mail con el link `http://localhost:4200/verify-email?token=<token>` (no devuelve el token en la response). Se crearon los endpoints `POST /auth/verify-email` (sin auth) y `POST /auth/resend-verification` (JWT). `GET /auth/me` ahora devuelve `isVerified`. El envío real se hace vía Resend a través de `MailService.sendVerification()`.

### Código Modificado
- src/users/user.entity.ts
- src/auth/auth.service.ts
- src/auth/auth.controller.ts
- src/auth/dto/verify-email.dto.ts
- src/mail/mail.module.ts
- src/mail/mail.service.ts

### Justificación de Modificación
Cumple el spec del práctico (1.1 y 1.7): tokens UUID, envío con servicio real, no se exponen tokens en responses, response 400 `{ message: "Token inválido o expirado" }` modelado con `HttpException` para que la respuesta tenga exactamente la forma pedida.

## Práctico Final 1.2 — Verificación de email (Frontend)
### Título de Modificación
Páginas `/verify-pending` y `/verify-email`, integración con register y profile.

### Descripción de Modificación
Se crearon las páginas `VerifyPendingPage` (mensaje + botón "Reenviar email") y `VerifyEmailPage` (lee token de queryParams, llama a la API, muestra éxito o error). `register.ts` redirige a `/verify-pending` tras un registro exitoso. `profile.html` muestra el badge "Verificado"/"No verificado" con botón de reenvío cuando aplica.

### Código Modificado
- src/app/pages/verify-pending/verify-pending.{ts,html,css}
- src/app/pages/verify-email/verify-email.{ts,html,css}
- src/app/pages/register/register.ts
- src/app/pages/profile/profile.{ts,html}
- src/app/services/auth.service.ts
- src/app/models/user.ts
- src/app/app.routes.ts

### Justificación de Modificación
Completa el flujo visual exigido por el spec (1.2 y 1.7). La UX guía al usuario desde el registro hasta la verificación sin pasos manuales.

## Práctico Final 1.3 — Recuperación de contraseña (Backend)
### Título de Modificación
Endpoints `forgot-password` / `reset-password` con token persistido en `UserEntity`.

### Descripción de Modificación
Se agregaron a `UserEntity` los campos `resetPasswordToken` (string nullable) y `resetPasswordExpires` (datetime nullable). `POST /auth/forgot-password` genera un token con `crypto.randomUUID()`, lo guarda con expiración configurable (default 60 minutos) y envía el mail con el link `http://localhost:4200/reset-password?token=<token>`. Responde siempre `{ message: "Si el email existe, recibirás un link" }` para evitar enumeración de usuarios. `POST /auth/reset-password` valida token + expiración, hashea la nueva contraseña con bcrypt y limpia los campos de reset. Errores devuelven 400 `{ message: "Token inválido o expirado" }`.

### Código Modificado
- src/users/user.entity.ts
- src/auth/auth.service.ts
- src/auth/auth.controller.ts
- src/auth/dto/forgot-password.dto.ts
- src/auth/dto/reset-password.dto.ts
- src/mail/mail.service.ts

### Justificación de Modificación
Matchea el spec literal: campos en UserEntity (no tabla separada), body `{ token, password }`, responses con `message`, tokens UUID, expiración ~1h, anti-enumeración.

## Práctico Final 1.4 — Recuperación de contraseña (Frontend)
### Título de Modificación
Páginas `/forgot-password` y `/reset-password`.

### Descripción de Modificación
Se crearon `ForgotPasswordPage` (form con email y mensaje genérico al enviar) y `ResetPasswordPage` (lee token del queryParam, valida coincidencia de contraseñas, llama a la API y muestra una pantalla de éxito con link manual a `/login`). El login incluye el link "¿Olvidaste tu contraseña?" apuntando a `/forgot-password`.

### Código Modificado
- src/app/pages/forgot-password/forgot-password.{ts,html,css}
- src/app/pages/reset-password/reset-password.{ts,html,css}
- src/app/pages/login/login.html
- src/app/services/auth.service.ts
- src/app/app.routes.ts

### Justificación de Modificación
Cumple el spec literal: rutas con el nombre pedido, body `{ token, password }`, sin auto-redirect (link manual al login).

## Práctico Final 1.5 — Toast service
### Título de Modificación
Servicio de notificaciones reutilizable con componente global.

### Descripción de Modificación
Se creó `ToastService` con métodos `success()`, `error()`, `info()` que emiten a un signal `toasts`. El componente `ToastComponent` (montado en `app.html`) renderiza los toasts en la esquina superior derecha y los auto-destruye a los 4 segundos. Todos los flujos de auth ahora usan toasts en lugar de `{{ error }}` local: register, login, verify-email, verify-pending (resend), forgot-password, reset-password, profile.

### Código Modificado
- src/app/services/toast.service.ts
- src/app/shared/toast/toast.{ts,html,css}
- src/app/app.{ts,html}
- src/app/pages/login/login.ts
- src/app/pages/register/register.ts
- src/app/pages/forgot-password/forgot-password.ts
- src/app/pages/reset-password/reset-password.ts
- src/app/pages/verify-email/verify-email.ts
- src/app/pages/verify-pending/verify-pending.ts

### Justificación de Modificación
Centraliza la presentación de feedback al usuario (criterio 1.7: nunca mostrar errores en consola). Servicio basado en Signals para mantener la línea reactiva del resto del proyecto.

## Práctico Final 1.6 — Cambio de contraseña y email desde el perfil
### Título de Modificación
Endpoints `PATCH /users/me/password` y `PATCH /users/me/email` + formularios en `profile.html`.

### Descripción de Modificación
Se creó `AccountService` con dos operaciones autenticadas:
- `changePassword`: valida la contraseña actual con bcrypt, hashea la nueva y persiste.
- `changeEmail`: valida la contraseña actual, descarta si el email coincide con el actual o ya está en uso por otro usuario; persiste el email nuevo, lo marca como no verificado y dispara un nuevo mail de verificación.

`AccountController` expone ambos endpoints bajo `users/me`. En el frontend se agregó `AccountService` y dos formularios independientes en `profile.html` con sus respectivos toasts.

### Código Modificado
- src/users/services/account.service.ts
- src/users/controllers/account.controller.ts
- src/users/dto/change-password.dto.ts
- src/users/dto/change-email.dto.ts
- src/users/users.module.ts
- src/app/services/account.service.ts
- src/app/pages/profile/profile.{ts,html}

### Justificación de Modificación
Cumple el spec (1.6 y 1.7). El cambio de email re-dispara la verificación para evitar que un usuario "robe" la cuenta cambiando el correo y manteniendo el badge de verificado.

## Práctico Final — Validación global
### Título de Modificación
ValidationPipe global activado.

### Descripción de Modificación
Se descomentó y configuró el `ValidationPipe` global en `main.ts` con `whitelist: true` y `transform: true` para que todos los DTOs (login, register, forgot-password, reset-password, verify-email, change-password, change-email) ejecuten las reglas de `class-validator`.

### Código Modificado
- src/main.ts

### Justificación de Modificación
Sin esto los decoradores `@IsEmail`, `@MinLength`, etc. no se aplican y los endpoints aceptarían bodies inválidos. Es un requisito del criterio 1.7.

## Extra — `verifiedGuard` (fuera del agregado del práctico)
### Título de Modificación
Guard de ruta que bloquea el acceso a áreas protegidas hasta que el usuario verifique su email.

### Descripción de Modificación
Esta modificación **no está en el spec del práctico**. El spec exige que el flujo de verificación esté implementado pero no obliga a bloquear el resto de la app si el usuario no verificó. Se agregó por decisión propia para que el flujo de verificación tenga consecuencias funcionales y no sea solo cosmético.

Se creó `verifiedGuard` (`CanActivateFn`) que:
- Si `auth.user()` ya está cargado: permite si `isVerified`, sino redirige a `/verify-pending`.
- Si el signal todavía es `null` (caso típico al refrescar con token en localStorage): espera vía `toObservable` a que `me()` resuelva, y decide con esa data.

El guard se aplicó en `app.routes.ts` a `products`, `products/:id`, `categories` y `admin/users`. **No** se aplicó a `profile` para que el usuario sin verificar pueda seguir entrando al perfil y usar el botón "Reenviar email" o cambiar de email.

Además, `login.ts` ahora redirige a `/verify-pending` si la respuesta del login trae `isVerified: false`, en lugar de mandar a `/` y dejar al usuario sin orientación.

### Código Modificado
- src/app/guards/verified.guard.ts (nuevo)
- src/app/app.routes.ts
- src/app/pages/login/login.ts

### Justificación de Modificación
Se evaluaron tres alternativas frente al dead-end que produce un bloqueo total de login en usuarios no verificados:
1. No hacer nada (login libre, sin consecuencias).
2. Bloquear login con 403 (pero deja sin forma de reenviar el mail, porque `resend-verification` requiere JWT).
3. Permitir login pero bloquear las rutas protegidas (esta).

La opción 3 mantiene la seguridad efectiva (los recursos sensibles quedan inaccesibles) sin crear ciclos imposibles (el usuario tiene JWT para llamar a `resend-verification` y a la verificación de email). Es además el patrón estándar en aplicaciones reales.
