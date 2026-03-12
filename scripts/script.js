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
    // Usar la función de productos.js
    const producto = obtenerProductoPorId(id);
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
    
    // Usar la función de productos.js
    const productosFiltrados = obtenerProductos(filtroActual, ordenActual);
    
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
        const tieneEnvioGratis = producto.precio > 25 || producto.envioGratis;
        
        // Determinar badge
        let badgeHTML = '';
        if (producto.badge) {
            const badgeClass = producto.badge === 'OFERTA' ? 'producto-badge-oferta' : '';
            badgeHTML = `<span class="producto-badge ${badgeClass}">${producto.badge}</span>`;
        } else if (producto.destacado) {
            badgeHTML = '<span class="producto-badge">MÁS VENDIDO</span>';
        }
        
        // Precio anterior
        const precioAnteriorHTML = producto.precioAnterior ? 
            `<span class="precio-anterior">$${producto.precioAnterior.toFixed(2)}</span>` : '';
        
        return `
        <div class="producto-card">
            <a href="#" class="producto-link" onclick="event.preventDefault()">
                <div class="producto-img">
                    ${badgeHTML}
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                </div>
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <div class="producto-precio">
                        <span class="precio-actual">$${producto.precio.toFixed(2)}</span>
                        ${precioAnteriorHTML}
                    </div>
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

            // Construir el mensaje con emojis codificados
            let mensaje = "%F0%9F%8C%B9 ¡Hola! Quiero hacer un pedido:%0A%0A"; // ✨

            // Agregar cada producto
            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                mensaje += `• ${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad} = $${subtotal.toFixed(2)}%0A`;
            });

            // Calcular total
            const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            mensaje += `%0A%F0%9F%93%8D *TOTAL: $${total.toFixed(2)}*%0A%0A`; // 📍
            mensaje += `%F0%9F%8C%BF ¡Gracias por elegir Jacarandá!`; // ✨ (variante)

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
    initTienda();
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