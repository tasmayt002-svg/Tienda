  const cartSidebar = document.getElementById('cartSidebar');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const cartCountElements = document.querySelectorAll('.cart-count');

  // Funciones para mostrar/ocultar carrito lateral
  function openCart() {
    cartSidebar.classList.add('open');
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
  }

  openCartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);

  // Control del carrito en localStorage
  function getCart() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  }

  function saveCart(cart) {
    localStorage.setItem('carrito', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
  }

  function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.cantidad, 0);
    cartCountElements.forEach(el => el.textContent = count);
  }


  function addToCart(producto) {
    console.log(producto);
    const cart = getCart();
    const existing = cart.find(item => item.id === producto.id);

    if (existing) {
      existing.cantidad += 1;
    } else {
      producto.cantidad = 1;
      cart.push(producto);
    }

    saveCart(cart);
    console.log(`${producto.nombre} agregado al carrito`);
  }

  function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== id);
    saveCart(cart);

    // Si hay una función renderCart() definida en el contexto actual, la usamos
    if (typeof renderCart === 'function') {
      renderCart();
    }

    // Si hay una función renderCartItems() (en sidebar), también la actualizamos
    if (typeof renderCartItems === 'function') {
      renderCartItems();
    }

    updateCartCount();
  }

  function renderCartItems() {
    const cart = getCart();
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
      cartTotalPrice.textContent = '$0';
      return;
    }

    let total = 0;
    cart.forEach(item => {
      total += item.precio * item.cantidad;

      const div = document.createElement('div');
      div.className = 'cart-item';

      div.innerHTML = `
        <img src="${item.imagen_url}" alt="${item.nombre}" onerror="this.src='img/default.png'" />
        <div class="cart-item-info">
          <h3>${item.nombre}</h3>
          <p>Cantidad: ${item.cantidad}</p>
          <p>Precio: $${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
        </div>
        <div class="cart-item-actions">
          <button title="Eliminar producto" aria-label="Eliminar producto" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      `;

      cartItemsContainer.appendChild(div);
    });

    cartTotalPrice.textContent = `$${total.toLocaleString('es-CO')}`;
  }
    function resetCart() {
      localStorage.removeItem('carrito'); // Limpia el carrito en el localStorage
      updateCartCount(); // Actualiza el contador de ítems
      renderCartItems(); // Vuelve a renderizar el sidebar del carrito

      // Si también tienes el carrito en cart.html, lo actualizas
      if (typeof renderCart === 'function') {
        renderCart();
      }
    }



  // Actualiza contador y carrito al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCartItems();
  });
