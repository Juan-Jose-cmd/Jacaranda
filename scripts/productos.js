// ===== BASE DE DATOS DE PRODUCTOS =====
const productos = [
    {
        id: 1,
        nombre: "Colgante de Aromaterapia",
        descripcion: "Relajante y calmante. Ideal para dormir y reducir ansiedad.",
        precio: 8000,
        imagen: "../recursos/Arbol1.png",
        categoria: "aceites",
        destacado: false,
        envioGratis: false,
        cuotasDisponibles: false
    },
    {
        id: 2,
        nombre: "Colgante de Aromaterapia",
        descripcion: "Energizante y refrescante. Perfecto para concentración.",
        precio: 8000,
        imagen: "../recursos/Arbol2.png",
        categoria: "aceites",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 3,
        nombre: "Colgante de Aromaterapia",
        descripcion: "Descongestionante y purificador. Ideal para vías respiratorias.",
        precio: 8000,
        imagen: "../recursos/Alas.png",
        categoria: "aceites",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 4,
        nombre: "Colgante de Aromaterapia",
        descripcion: "Estimulante y fortalecedor. Bueno para la memoria.",
        precio: 8000,
        imagen: "../recursos/Loto.png",
        categoria: "aceites",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 5,
        nombre: `Libro: "Aromas que sanan"`,
        descripcion: "Suave y antiinflamatorio. Ideal para piel sensible.",
        precio: 10000,
        imagen: "../recursos/Libro.PNG",
        categoria: "aceites",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
];

// Función para obtener productos filtrados
function obtenerProductos(filtro = "todos", orden = "recomendados") {
    let productosFiltrados = [...productos];
    
    // Aplicar filtro por categoría
    if (filtro !== "todos") {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === filtro);
    }
    
    // Aplicar ordenamiento
    switch(orden) {
        case "menor-precio":
            productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
        case "mayor-precio":
            productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
        default: // recomendados
            productosFiltrados.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
    }
    
    return productosFiltrados;
}

// Función para obtener un producto por ID
function obtenerProductoPorId(id) {
    return productos.find(p => p.id === id);
}

// Función para obtener productos destacados
function obtenerProductosDestacados() {
    return productos.filter(p => p.destacado);
}

// Función para obtener categorías únicas
function obtenerCategorias() {
    const categorias = new Set(productos.map(p => p.categoria));
    return ["todos", ...categorias];
}