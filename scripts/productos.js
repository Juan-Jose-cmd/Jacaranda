// ===== BASE DE DATOS DE PRODUCTOS =====
const productos = [
    {
        id: 1,
        nombre: "Colgante de Aromaterapia",
        descripcion: "Lleva el aroma que amas",
        precio: 8000,
        imagen: "../recursos/Arbol1.png",
        categoria: "collares",
        destacado: false,
        envioGratis: false,
        cuotasDisponibles: false
    },
    {
        id: 2,
        nombre: "Colgante de Aromaterapia",
        descripcion: "Lleva el aroma que amas",
        precio: 8000,
        imagen: "../recursos/Arbol2.png",
        categoria: "collares",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 3,
        nombre: "Colgante de Aromaterapia",
        descripcion: "Lleva el aroma que amas",
        precio: 8000,
        imagen: "../recursos/AGOTADO.png",
        categoria: "collares",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 4,
        nombre: "Colgante de Aromaterapia",
        descripcion: "Lleva el aroma que amas",
        precio: 8000,
        imagen: "../recursos/Loto.png",
        categoria: "collares",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 5,
        nombre: "El aroma y su poder curativo",
        descripcion: "Iniciá tu viaje holístico",
        precio: 10000,
        imagen: "../recursos/Libro.PNG",
        categoria: "libro",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 6,
        nombre: "Colgante Aroma con Botella Vacía Grabada en Cristal y Caja de Piedra del Amor",
        descripcion: "Ideal para compartir los aromas",
        precio: 30000,
        imagen: "../recursos/CajitaDeBotellitas.PNG",
        categoria: "collares",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 7,
        nombre: "Almohadillas de repuesto de fieltro redondo de colores",
        descripcion: "",
        precio: 14000,
        imagen: "../recursos/Almoadillas.PNG",
        categoria: "collares",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 8,
        nombre: "Botella de Perfume",
        descripcion: "Lleva el perfume que quieras, donde quieras",
        precio: 14000,
        imagen: "../recursos/ColganteBotellitapuntiagudo.PNG",
        categoria: "collares",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 9,
        nombre: "Burrito",
        descripcion: "Lleva el perfume que quieras, donde quieras",
        precio: 500,
        imagen: "../recursos/Burrito.PNG",
        categoria: "collares",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 10,
        nombre: "Abedul",
        descripcion: "Lleva el perfume que quieras, donde quieras",
        precio: 500,
        imagen: "../recursos/Abedul.PNG",
        categoria: "collares",
        destacado: false,
        envioGratis: true,
        cuotasDisponibles: false
    },
    {
        id: 11,
        nombre: "Acedera",
        descripcion: "Lleva el perfume que quieras, donde quieras",
        precio: 500,
        imagen: "../recursos/Acedera.PNG",
        categoria: "collares",
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