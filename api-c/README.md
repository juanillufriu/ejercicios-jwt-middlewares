# ejercicios-rest

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
