# Comandos del Práctico Final (Backend, Frontend y MCP)

## 1. Arranque de los Proyectos Base
Comandos iniciales para instalar dependencias y levantar los servidores de desarrollo.

```bash
# Servidor Backend (NestJS + PostgreSQL)
cd back && npm install && npm run start:dev

# Servidor Frontend (Angular)
cd front && npm install && npm start
```

## 2. Inicialización del Entorno MCP
Pasos para configurar las dependencias necesarias dentro de la suite del protocolo de contexto.

```bash
# Entrar a la carpeta del servidor MCP e instalar dependencias de la plantilla
cd mcp && npm install
```

## 3. Pruebas y Validación Local del MCP
Comandos para comprobar el estado de compilación y comportamiento del puente de herramientas.

```bash
# Levantar el servidor MCP de forma directa (Usa entrada/salida estándar)
npx tsx mcp/src/index.ts

# Levantar el servidor inyectando variables de entorno en la consola (PowerShell)
\$env:API_C_URL="http://localhost:3000"; \(env:API_C_EMAIL="admin@mail.com"; \)env:API_C_PASSWORD="12345678"; npx tsx mcp/src/index.ts
```

## 4. Herramientas de Depuración Avanzada (Debugging)
Método visual e interactivo mediante interfaz web para verificar que las herramientas respondan correctamente a las llamadas JSON-RPC.

```bash
# Lanzar el inspector oficial de Anthropic para probar las herramientas en el navegador
npx @modelcontextprotocol/inspector npx tsx mcp/src/index.ts
```
