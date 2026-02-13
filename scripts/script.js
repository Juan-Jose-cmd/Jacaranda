// ===== BASE DE DATOS DE PRODUCTOS =====
const productos = [
    {
        id: 1,
        nombre: "Aceite de Lavanda",
        descripcion: "Relajante y calmante. Ideal para dormir y reducir ansiedad.",
        precio: 15.99,
        imagen: "https://mejorconsalud.as.com/wp-content/uploads/2022/05/aceite-esencial.jpg",
        categoria: "aceites",
        destacado: true
    },
    {
        id: 2,
        nombre: "Aceite de Menta",
        descripcion: "Energizante y refrescante. Perfecto para concentración.",
        precio: 14.99,
        imagen: "https://mejorconsalud.as.com/wp-content/uploads/2022/05/aceite-esencial.jpg",
        categoria: "aceites",
        destacado: true
    },
    {
        id: 3,
        nombre: "Aceite de Eucalipto",
        descripcion: "Descongestionante y purificador. Ideal para vías respiratorias.",
        precio: 16.99,
        imagen: "https://mejorconsalud.as.com/wp-content/uploads/2022/05/aceite-esencial.jpg",
        categoria: "aceites",
        destacado: false
    },
    {
        id: 4,
        nombre: "Aceite de Romero",
        descripcion: "Estimulante y fortalecedor. Bueno para la memoria.",
        precio: 15.99,
        imagen: "https://mejorconsalud.as.com/wp-content/uploads/2022/05/aceite-esencial.jpg",
        categoria: "aceites",
        destacado: false
    },
    {
        id: 5,
        nombre: "Aceite de Manzanilla",
        descripcion: "Suave y antiinflamatorio. Ideal para piel sensible.",
        precio: 17.99,
        imagen: "https://mejorconsalud.as.com/wp-content/uploads/2022/05/aceite-esencial.jpg",
        categoria: "aceites",
        destacado: false
    },
    {
        id: 6,
        nombre: "Aceite de Árbol de Té",
        descripcion: "Antiséptico y antifungal. Perfecto para el cuidado de la piel.",
        precio: 18.99,
        imagen: "https://mejorconsalud.as.com/wp-content/uploads/2022/05/aceite-esencial.jpg",
        categoria: "aceites",
        destacado: false
    },
    {
        id: 7,
        nombre: "Difusor Cerámico",
        descripcion: "Difusor ultrasónico de cerámica hecho a mano.",
        precio: 45.99,
        imagen: "https://mejorconsalud.as.com/wp-content/uploads/2022/05/aceite-esencial.jpg",
        categoria: "difusores",
        destacado: false
    },
    {
        id: 8,
        nombre: "Set Relax",
        descripcion: "Lavanda + Manzanilla + Difusor de viaje",
        precio: 39.99,
        imagen: "https://mejorconsalud.as.com/wp-content/uploads/2022/05/aceite-esencial.jpg",
        categoria: "sets",
        destacado: false
    }
];

// ===== VARIABLES GLOBALES =====
let carrito = [];
let filtroActual = "todos";
let ordenActual = "recomendados";

// ===== ELEMENTOS DEL DOM =====
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const navMenu = document.getElementById('navMenu');
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const productosGrid = document.getElementById('productosGrid');

// ===== FUNCIONES DE MENÚ =====
function initMenu() {
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', cerrarMenu);
    }
    
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', cerrarMenu);
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            cerrarMenu();
            cerrarCarrito();
        }
    });
}

function cerrarMenu() {
    if (navMenu) {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== FUNCIONES DE CARRITO =====
function initCarrito() {
    // Cargar carrito guardado
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        try {
            carrito = JSON.parse(carritoGuardado);
            actualizarCarritoUI();
        } catch (e) {
            console.error('Error al cargar carrito');
        }
    }
    
    // Event listeners del carrito
    if (cartToggle) {
        cartToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            cartPanel.classList.toggle('active');
            if (navMenu && navMenu.classList.contains('active')) {
                cerrarMenu();
            }
        });
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', cerrarCarrito);
    }
}

function cerrarCarrito() {
    if (cartPanel) {
        cartPanel.classList.remove('active');
    }
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    const itemExistente = carrito.find(item => item.id === id);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    actualizarCarritoUI();
    guardarCarrito();
    
    // Feedback visual estilo ML
    const btn = event?.target?.closest('.btn-agregar');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> Agregado';
        btn.classList.add('agregado');
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-cart-plus"></i> Agregar';
            btn.classList.remove('agregado');
        }, 1500);
    }
    
    // Mostrar carrito
    if (cartPanel) {
        cartPanel.classList.add('active');
        if (navMenu && navMenu.classList.contains('active')) {
            cerrarMenu();
        }
    }
}

function aumentarCantidad(id) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad += 1;
        actualizarCarritoUI();
        guardarCarrito();
    }
}

function disminuirCantidad(id) {
    const item = carrito.find(item => item.id === id);
    if (item && item.cantidad > 1) {
        item.cantidad -= 1;
        actualizarCarritoUI();
        guardarCarrito();
    } else {
        eliminarDelCarrito(id);
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarritoUI();
    guardarCarrito();
}

function actualizarCarritoUI() {
    if (!cartCount || !cartItems || !cartTotal) return;
    
    // Actualizar contador
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar items
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = carrito.map(item => `
        <div class="cart-item">
            <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.nombre}</div>
                <div class="cart-item-price">$${(item.precio * item.cantidad).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="disminuirCantidad(${item.id})">-</button>
                    <span>${item.cantidad}</span>
                    <button class="quantity-btn" onclick="aumentarCantidad(${item.id})">+</button>
                    <button class="cart-item-remove" onclick="eliminarDelCarrito(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Actualizar total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// ===== FUNCIONES DE TIENDA =====
function initTienda() {
    if (!productosGrid) return;
    console.log('Inicializando tienda...');
    cargarProductos();
    initFiltros();
    initOrdenamiento();
}

function cargarProductos() {
    if (!productosGrid) return;
    
    console.log('Cargando productos...');
    
    let productosFiltrados = [...productos];
    
    // Aplicar filtro
    if (filtroActual !== 'todos') {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === filtroActual);
    }
    
    // Aplicar orden
    if (ordenActual === 'menor-precio') {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenActual === 'mayor-precio') {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
    }
    
    // Renderizar estilo Mercado Libre
    if (productosFiltrados.length === 0) {
        productosGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-seedling" style="font-size: 3rem; color: var(--jacaranda-claro); margin-bottom: 1rem;"></i>
                <p style="color: var(--violeta-profundo);">No encontramos productos en esta categoría</p>
            </div>
        `;
        return;
    }
    
    productosGrid.innerHTML = productosFiltrados.map(producto => {
        // Calcular cuotas simuladas
        const cuotas = Math.floor(producto.precio / 3);
        const tieneEnvioGratis = producto.precio > 25;
        const esOferta = producto.id === 1 || producto.id === 3;
        
        return `
        <div class="producto-card">
            <a href="#" class="producto-link" onclick="event.preventDefault()">
                <div class="producto-img">
                    ${esOferta ? '<span class="producto-badge producto-badge-oferta">OFERTA</span>' : ''}
                    ${producto.destacado ? '<span class="producto-badge">MÁS VENDIDO</span>' : ''}
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                </div>
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <div class="producto-precio">
                        <span class="precio-actual">$${producto.precio.toFixed(2)}</span>
                        ${producto.id === 3 ? '<span class="precio-anterior">$22.99</span>' : ''}
                    </div>
                    <div class="producto-cuotas">
                        hasta ${cuotas} cuotas sin interés
                    </div>
                    ${tieneEnvioGratis ? `
                    <div class="producto-envio">
                        <i class="fas fa-truck"></i> Envío gratis
                    </div>
                    ` : ''}
                </div>
            </a>
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                <i class="fas fa-cart-plus"></i> Agregar
            </button>
        </div>
    `}).join('');
    
    console.log('Productos cargados:', productosFiltrados.length);
}

function initFiltros() {
    const filtros = document.querySelectorAll('.filtro-btn');
    if (!filtros.length) return;
    
    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            filtros.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtroActual = btn.dataset.filtro;
            cargarProductos();
        });
    });
}

function initOrdenamiento() {
    const ordenarSelect = document.getElementById('ordenarPor');
    if (!ordenarSelect) return;
    
    ordenarSelect.addEventListener('change', (e) => {
        ordenActual = e.target.value;
        cargarProductos();
    });
}

// ===== FUNCIONES DE CONTACTO =====
function initContacto() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('✨ ¡Gracias por contactarnos! María te responderá en menos de 24 horas.');
            contactForm.reset();
        });
    }
    
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('📧 ¡Gracias por suscribirte! Revisa tu correo para confirmar.');
            newsletterForm.reset();
        });
    }
}

// ===== CHECKOUT =====
function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('🛒 Tu carrito está vacío');
                return;
            }
            
            // Construir el mensaje con los productos del carrito
            let mensaje = "Hola! Quiero hacer un pedido:%0A%0A";
            
            // Agregar cada producto
            carrito.forEach(item => {
                mensaje += `• ${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad} = $${(item.precio * item.cantidad).toFixed(2)}%0A`;
            });
            
            // Calcular total
            const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            mensaje += `%0A📍 *TOTAL: $${total.toFixed(2)}*%0A`;
            mensaje += `%0A📍 Zona: Rosario, Santa Fe%0A`;
            mensaje += `%0A📍 Método de pago: (a confirmar)%0A`;
            mensaje += `%0A📦 Envío: (a coordinar)%0A%0A`;
            mensaje += `✨ ¡Gracias por elegir Jacarandá!`;
            
            // Número de WhatsApp
            const numero = "5493415806460";
            
            // Crear enlace
            const url = `https://wa.me/${numero}?text=${mensaje}`;
            
            // Abrir WhatsApp
            window.open(url, '_blank');
            
            // Limpiar carrito
            carrito = [];
            actualizarCarritoUI();
            guardarCarrito();
            cerrarCarrito();
        });
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado');
    initMenu();
    initCarrito();
    initTienda(); // ¡ESTA LÍNEA ES LA QUE FALTABA!
    initContacto();
    initCheckout();
});

// Guardar carrito antes de cerrar
window.addEventListener('beforeunload', () => {
    guardarCarrito();
});

// Exponer funciones globales para los onclick
window.agregarAlCarrito = agregarAlCarrito;
window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;