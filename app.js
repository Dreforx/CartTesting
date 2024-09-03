// Función para cargar productos desde el JSON y mostrarlos en la página
function loadProducts() {
    fetch('data.json')
       .then(response => response.json())
       .then(data => {
            displayProducts(data);
       })
       .catch(error => console.error('Error:', error));
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML =     
        `
                            <img 
                            src="${product.image.desktop}"
                            srcset="
                            ${product.image.mobile} 375w,
                            ${product.image.tablet} 768w,
                            ${product.image.thumbnail} 1000w,
                            ${product.image.desktop} 1440w
                            "
                            alt="${product.name}">
                        
                        
                            <h3>${product.name}</h3> 
                       
                            <h4>${product.category}</h4> 
                        
                            <p>$${product.price}</p>
                       
            <button class="add-to-cart-btn" data-name="${product.name}">Add to Cart</button>
        `;
        
        productsContainer.appendChild(productItem);
    });

    // Agregar eventos a los botones "Add to Cart"
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-name');
            const product = products.find(p => p.name === productName);
            addToCart(product);
        });
    });
}

// Variables globales para el carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
    const cartContainer = document.getElementById('cart-items');
    let cartItem = cartContainer.querySelector(`[data-name="${product.name}"]`);

    product.price = parseFloat(product.price.toString().replace('$', ''));
    
    if (!cartItem) {
        // Si el producto no está en el carrito, lo añadimos con una cantidad inicial de 1
        const newProduct = { ...product, quantity: 1 };
        cart.push(newProduct);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Crear un nuevo elemento en el carrito
        cartItem = document.createElement('div');
        cartItem.dataset.name = product.name;
        cartItem.innerHTML = `
            <h3>${product.name}</h3>
            <p id="value-${product.name}">Price: $${product.price}</p>
            <p id="cant-${product.name}">Cantidad: 1</p>
        `;
        cartContainer.appendChild(cartItem);
    } else {
        // Si el producto ya está en el carrito, solo actualizamos la cantidad
        const cartProduct = cart.find(p => p.name === product.name);
        cartProduct.quantity = (cartProduct.quantity || 0) + 1;
        localStorage.setItem('cart', JSON.stringify(cart));

        const quantityElement = document.getElementById(`cant-${product.name}`);
        const priceElement  = document.getElementById(`value-${product.name}`);
        if (quantityElement) {
            quantityElement.textContent = `Cantidad: ${cartProduct.quantity}`;
            priceElement.textContent = `Price: $${cartProduct.quantity * product.price}`;
        }
    }

    console.log(`${product.name} added to cart!`);
    updateTotalPrice();
}
loadProducts();

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    const cartContainer = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    totalPrice.textContent = 'Total Price: $0';
    cartContainer.innerHTML = '';
    console.log('Cart cleared!');
}

// Evento para vaciar el carrito al hacer click en el botón

const clearCartButton = document.getElementById('clear-cart-btn');
clearCartButton.addEventListener('click', clearCart);

let totalPrice = 0;

function updateTotalPrice() {
    totalPrice = 0;
    cart.forEach(product => {
        totalPrice += product.price * product.quantity;
    });
    document.getElementById('total-price').textContent = `Total Price: $${totalPrice}`;
}


//Confirm order

const checkoutButton = document.getElementById('checkout');
checkoutButton.addEventListener('click', function() {
    if (cart.length > 0) {
        alert('Order confirmed!');
        clearCart();
    } else {
        alert('Your cart is empty!');
    }
});
