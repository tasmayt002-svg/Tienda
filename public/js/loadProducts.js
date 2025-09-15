document.addEventListener("DOMContentLoaded", () => {
  fetch("../backend/get_productos.php")
    .then(response => response.json())
    .then(data => {
      console.log("Productos cargados:", data);

      const destacadosContainer = document.getElementById("destacadosContainer");
      const otrosContainer = document.getElementById("otrosContainer");

      destacadosContainer.innerHTML = "";
      otrosContainer.innerHTML = "";

      data.forEach(producto => {
        const card = document.createElement("article");
        card.classList.add("product-card");

        const imageSrc = producto.imagen_url
          ? `../backend/get_image.php?img=${encodeURIComponent(producto.imagen_url)}`
          : 'img/default.png';

        card.innerHTML = `
          <img src="${imageSrc}" alt="${producto.nombre}" onerror="this.src='img/default.png'">
          <div class="product-info">
            <h2>${producto.nombre}</h2>
            <p>${producto.descripcion}</p>
            <div class="price">$${parseInt(producto.precio).toLocaleString('es-CO')} COP</div>
          </div>
        `;

        const button = document.createElement("button");
        button.className = "btn-outline";
        button.textContent = "Agregar al carrito";
        button.addEventListener("click", () => {
          addToCart({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen_url: imageSrc
          });
        });

        card.querySelector(".product-info").appendChild(button);

        if (producto.destacado == 1) {
          destacadosContainer.appendChild(card);
        } else {
          otrosContainer.appendChild(card);
        }
      });
    })
    .catch(err => console.error("Error al cargar productos:", err));
});
