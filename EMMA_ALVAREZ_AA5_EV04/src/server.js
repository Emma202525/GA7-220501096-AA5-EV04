// GA7-220501096-AA5-EV03
// Sistema de inventario sencillo para tiendas.
// API REST desarrollada con Node.js y Express.
//
// Funcionalidades:
// - Registro e inicio de sesión.
// - Crear, consultar, actualizar y eliminar productos.
// - Registrar entradas y salidas de inventario.
// - Consultar movimientos.
// - Consultar resumen del inventario.
//
// Para una aplicación productiva se recomienda utilizar una base de datos,
// autenticación mediante JWT/sesiones, HTTPS y variables de entorno.

const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_DIR = path.join(__dirname, "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const MOVEMENTS_FILE = path.join(DATA_DIR, "movements.json");

// ---------- Persistencia sencilla mediante archivos JSON ----------

function initializeStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  for (const file of [USERS_FILE, PRODUCTS_FILE, MOVEMENTS_FILE]) {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, "[]", "utf8");
    }
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function nextId(items) {
  return items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// ---------- Ruta principal ----------

app.get("/", (req, res) => {
  res.json({
    mensaje: "API del sistema de inventario funcionando correctamente.",
    version: "1.0.0",
    endpoints: {
      autenticacion: "/api/registro, /api/login",
      productos: "/api/productos",
      inventario: "/api/inventario/entrada, /api/inventario/salida",
      movimientos: "/api/movimientos",
      resumen: "/api/inventario/resumen"
    }
  });
});

// ---------- AUTENTICACIÓN ----------

// Registro de usuarios del sistema.
app.post("/api/registro", async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({
        mensaje: "El usuario y la contraseña son obligatorios."
      });
    }

    if (contrasena.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener mínimo 6 caracteres."
      });
    }

    const users = readJson(USERS_FILE);
    const exists = users.some(
      user => user.usuario.toLowerCase() === usuario.trim().toLowerCase()
    );

    if (exists) {
      return res.status(409).json({
        mensaje: "El usuario ya se encuentra registrado."
      });
    }

    const passwordHash = await bcrypt.hash(contrasena, 10);

    users.push({
      id: nextId(users),
      usuario: usuario.trim(),
      passwordHash
    });

    writeJson(USERS_FILE, users);

    res.status(201).json({
      mensaje: "Usuario registrado correctamente."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
});

// Inicio de sesión.
app.post("/api/login", async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({
        mensaje: "El usuario y la contraseña son obligatorios."
      });
    }

    const users = readJson(USERS_FILE);
    const user = users.find(
      item => item.usuario.toLowerCase() === usuario.trim().toLowerCase()
    );

    if (!user || !(await bcrypt.compare(contrasena, user.passwordHash))) {
      return res.status(401).json({
        mensaje: "Error en la autenticación."
      });
    }

    res.json({
      mensaje: "Autenticación satisfactoria."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor." });
  }
});

// ---------- PRODUCTOS ----------

// Consultar todos los productos.
app.get("/api/productos", (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  res.json(products);
});

// Consultar un producto por ID.
app.get("/api/productos/:id", (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const product = products.find(item => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({
      mensaje: "Producto no encontrado."
    });
  }

  res.json(product);
});

// Crear un producto.
// Campos: nombre, categoria, precio, stockMinimo y stock.
app.post("/api/productos", (req, res) => {
  const { nombre, categoria, precio, stockMinimo, stock } = req.body;

  if (!nombre || !categoria || precio === undefined) {
    return res.status(400).json({
      mensaje: "Nombre, categoría y precio son obligatorios."
    });
  }

  if (Number(precio) < 0 || Number(stockMinimo || 0) < 0 || Number(stock || 0) < 0) {
    return res.status(400).json({
      mensaje: "Precio y cantidades no pueden ser negativos."
    });
  }

  const products = readJson(PRODUCTS_FILE);

  const product = {
    id: nextId(products),
    nombre: nombre.trim(),
    categoria: categoria.trim(),
    precio: Number(precio),
    stockMinimo: Number(stockMinimo || 0),
    stock: Number(stock || 0)
  };

  products.push(product);
  writeJson(PRODUCTS_FILE, products);

  res.status(201).json({
    mensaje: "Producto creado correctamente.",
    producto: product
  });
});

// Actualizar un producto.
app.put("/api/productos/:id", (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex(item => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      mensaje: "Producto no encontrado."
    });
  }

  const { nombre, categoria, precio, stockMinimo, stock } = req.body;

  products[index] = {
    ...products[index],
    ...(nombre !== undefined && { nombre: nombre.trim() }),
    ...(categoria !== undefined && { categoria: categoria.trim() }),
    ...(precio !== undefined && { precio: Number(precio) }),
    ...(stockMinimo !== undefined && { stockMinimo: Number(stockMinimo) }),
    ...(stock !== undefined && { stock: Number(stock) })
  };

  writeJson(PRODUCTS_FILE, products);

  res.json({
    mensaje: "Producto actualizado correctamente.",
    producto: products[index]
  });
});

// Eliminar un producto.
app.delete("/api/productos/:id", (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const index = products.findIndex(item => item.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      mensaje: "Producto no encontrado."
    });
  }

  const deleted = products.splice(index, 1)[0];
  writeJson(PRODUCTS_FILE, products);

  res.json({
    mensaje: "Producto eliminado correctamente.",
    producto: deleted
  });
});

// ---------- INVENTARIO ----------

// Registrar una entrada de productos.
app.post("/api/inventario/entrada", (req, res) => {
  updateInventory(req, res, "entrada");
});

// Registrar una salida de productos.
app.post("/api/inventario/salida", (req, res) => {
  updateInventory(req, res, "salida");
});

// Función reutilizada para entradas y salidas.
function updateInventory(req, res, tipo) {
  const { productoId, cantidad, observacion } = req.body;
  const quantity = Number(cantidad);

  if (!productoId || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      mensaje: "productoId y una cantidad entera mayor que cero son obligatorios."
    });
  }

  const products = readJson(PRODUCTS_FILE);
  const product = products.find(item => item.id === Number(productoId));

  if (!product) {
    return res.status(404).json({
      mensaje: "Producto no encontrado."
    });
  }

  // Una salida no puede superar las existencias actuales.
  if (tipo === "salida" && product.stock < quantity) {
    return res.status(400).json({
      mensaje: "Stock insuficiente para realizar la salida."
    });
  }

  if (tipo === "entrada") {
    product.stock += quantity;
  } else {
    product.stock -= quantity;
  }

  writeJson(PRODUCTS_FILE, products);

  const movements = readJson(MOVEMENTS_FILE);
  const movement = {
    id: nextId(movements),
    productoId: product.id,
    producto: product.nombre,
    tipo,
    cantidad: quantity,
    observacion: observacion || "",
    fecha: new Date().toISOString()
  };

  movements.push(movement);
  writeJson(MOVEMENTS_FILE, movements);

  res.status(201).json({
    mensaje: `Movimiento de ${tipo} registrado correctamente.`,
    stockActual: product.stock,
    movimiento: movement
  });
}

// Consultar todos los movimientos.
app.get("/api/movimientos", (req, res) => {
  res.json(readJson(MOVEMENTS_FILE));
});

// Consultar un resumen útil para el encargado de la tienda.
app.get("/api/inventario/resumen", (req, res) => {
  const products = readJson(PRODUCTS_FILE);

  const totalProductos = products.length;
  const unidades = products.reduce((sum, item) => sum + item.stock, 0);
  const valorInventario = products.reduce(
    (sum, item) => sum + item.precio * item.stock,
    0
  );
  const productosBajoStock = products.filter(
    item => item.stock <= item.stockMinimo
  );

  res.json({
    totalProductos,
    unidades,
    valorInventario,
    productosBajoStock
  });
});

// Middleware para rutas que no existen.
app.use((req, res) => {
  res.status(404).json({
    mensaje: "Endpoint no encontrado."
  });
});

initializeStorage();

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
