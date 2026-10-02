# Documentación de la API - Sistema de Inventario

## 1. Objetivo

Esta API permite administrar de manera sencilla el inventario de una tienda o pequeño negocio.

El sistema permite:

- Registrar usuarios.
- Iniciar sesión.
- Crear productos.
- Consultar productos.
- Actualizar productos.
- Eliminar productos.
- Registrar entradas de mercancía.
- Registrar salidas de mercancía.
- Consultar movimientos.
- Consultar un resumen del inventario.

## 2. Tecnología

- Node.js
- Express
- JavaScript
- bcryptjs
- Archivos JSON como almacenamiento sencillo
- Git para versionamiento

## 3. URL base

```text
http://localhost:3000
```

## 4. Endpoints

### Autenticación

| Método | Endpoint | Función |
|---|---|---|
| POST | `/api/registro` | Registrar usuario |
| POST | `/api/login` | Iniciar sesión |

### Productos

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/productos` | Listar productos |
| GET | `/api/productos/:id` | Consultar producto |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto |

### Inventario

| Método | Endpoint | Función |
|---|---|---|
| POST | `/api/inventario/entrada` | Aumentar existencias |
| POST | `/api/inventario/salida` | Disminuir existencias |
| GET | `/api/movimientos` | Consultar movimientos |
| GET | `/api/inventario/resumen` | Consultar resumen |

## 5. Ejemplos

### Crear producto

```json
{
  "nombre": "Arroz 500g",
  "categoria": "Granos",
  "precio": 2500,
  "stockMinimo": 5,
  "stock": 20
}
```

### Registrar entrada

```json
{
  "productoId": 1,
  "cantidad": 10,
  "observacion": "Compra al proveedor"
}
```

### Registrar salida

```json
{
  "productoId": 1,
  "cantidad": 3,
  "observacion": "Venta"
}
```

## 6. Códigos HTTP utilizados

- `200`: operación exitosa.
- `201`: recurso creado.
- `400`: datos enviados incorrectamente.
- `401`: error de autenticación.
- `404`: recurso no encontrado.
- `409`: conflicto, por ejemplo usuario duplicado.
- `500`: error interno.

## 7. Diseño funcional

El flujo principal es:

```text
Usuario
   |
   v
Registro / Login
   |
   v
Gestión de productos
   |
   +---- Crear producto
   +---- Consultar producto
   +---- Actualizar producto
   +---- Eliminar producto
   |
   v
Gestión de inventario
   |
   +---- Entrada
   +---- Salida
   +---- Movimientos
   +---- Resumen
```
