# GA7-220501096-AA5-EV04 - Documento de pruebas de API

**Aprendiz:** Emma Alvarez  
**Proyecto:** Sistema de inventario sencillo para tiendas  
**Herramienta:** Postman  
**API:** GA7-220501096-AA5-EV03

## 1. Objetivo

Realizar el testing de los servicios web del proyecto de inventario mediante Postman, verificando respuestas exitosas y validaciones de error.

## 2. Preparación

1. Instalar Postman.
2. Abrir una terminal en el proyecto.
3. Ejecutar:
   `npm install`
4. Ejecutar:
   `npm start`
5. Abrir Postman.
6. Importar `postman_collection_GA7_AA5_EV04.json`.
7. Confirmar `baseUrl = http://localhost:3000`.

## 3. Casos de prueba

| ID | Prueba | Método | Resultado esperado |
|---|---|---|---|
| P01 | Estado de API | GET / | 200 |
| P02 | Registrar usuario | POST /api/registro | 201 |
| P03 | Login correcto | POST /api/login | 200 |
| P04 | Crear producto | POST /api/productos | 201 |
| P05 | Listar productos | GET /api/productos | 200 |
| P06 | Consultar producto | GET /api/productos/:id | 200 |
| P07 | Entrada de inventario | POST /api/inventario/entrada | 201 |
| P08 | Salida de inventario | POST /api/inventario/salida | 201 |
| P09 | Consultar movimientos | GET /api/movimientos | 200 |
| P10 | Consultar resumen | GET /api/inventario/resumen | 200 |
| P11 | Stock insuficiente | POST /api/inventario/salida | 400 |

## 4. Evidencia mediante pantallazos

Agregar las capturas reales de Postman en esta sección:

### P01 - Estado de la API
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### P02 - Registro de usuario
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### P03 - Login correcto
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### P04 - Crear producto
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### P05 - Listar productos
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### P06 - Consultar producto
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### P07 - Entrada de inventario
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### P08 - Salida de inventario
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### P09 - Movimientos
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### P10 - Resumen
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### P11 - Stock insuficiente
[PEGAR CAPTURA REAL DE POSTMAN AQUÍ]

### Collection Runner
[PEGAR CAPTURA REAL DEL RESULTADO DE LA COLECCIÓN AQUÍ]

> Las capturas deben tomarse directamente en Postman durante la ejecución real. No se incluyen imágenes simuladas como evidencia de pruebas realizadas.

## 5. Resultado esperado

La colección de Postman contiene pruebas automáticas mediante `pm.test` para verificar códigos HTTP, mensajes y estructura básica de las respuestas.

## 6. Conclusión

Las pruebas cubren los servicios principales del sistema: autenticación, gestión de productos, movimientos de inventario, consulta de información y validación de stock insuficiente.
