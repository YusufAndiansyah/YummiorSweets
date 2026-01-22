// Data menu dengan harga dan deskripsi
const menuData = {
    cheesecake: {
        name: "Cheese Cake",
        price: 35000,
        description: "Cheese cake lembut dengan lapisan keju premium dan biskuit crumb yang renyah.",
        image: "Images/cheese cake.jpeg"
    },
    churros: {
        name: "Churros",
        price: 10000,
        description: "Churros renyah dengan taburan gula kayu manis dan cocolan cokelat leleh.",
        image: "Images/churros.jpeg"
    },
    cookies: {
        name: "Cookies",
        price: 10000,
        description: "Cookies cokelat chip dengan tekstur lembut di dalam dan renyah di luar.",
        image: "Images/cookies.jpeg"
    },
    cromboloni: {
        name: "Cromboloni",
        price: 25000,
        description: "Donat Italia dengan berbagai isian creamy seperti custard, cokelat, atau buah.",
        image: "Images/cromboloni.jpeg"
    },
    donat: {
        name: "Donat",
        price: 15000,
        description: "Donat empuk dengan berbagai topping glaze, cokelat, dan taburan warna-warni.",
        image: "Images/donat.jpg"
    },
    lukchup: {
        name: "Luk Chup",
        price: 40000,
        description: "Makanan tradisional Thailand berbentuk buah-buahan yang terbuat dari kacang hijau.",
        image: "Images/luk chup.jpeg"
    },
    macaron: {
        name: "Macaron",
        price: 25000,
        description: "Macaron Prancis dengan kulit renyah dan isian creamy berbagai rasa.",
        image: "Images/macaron.jpeg"
    },
    waffle: {
        name: "Waffle",
        price: 30000,
        description: "Waffle Belgia renyah dengan topping maple syrup, buah segar, dan whipped cream.",
        image: "Images/waffle.jpeg"
    },
    brownies: {
        name: "Brownies",
        price: 22000,
        description: "Brownies cokelat pekat dengan tekstur fudgy dan taburan kacang walnut.",
        image: "Images/brownies.jpeg"
    }
};

// Inisialisasi keranjang
let cart = [];
const cartKey = 'yummior_cart';

// DOM Elements
const menuPopup = document.getElementById('menuPopup');
const cartPopup = document.getElementById('cartPopup');
const closeBtns = document.querySelectorAll('.close-btn');
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkout');

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

// Update cart count in navbar
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Calculate total price
function calculateTotal(price, quantity) {
    return price * quantity;
}

// Update total price in popup
function updateTotalPrice() {
    const menu = menuData[menuPopup.dataset.currentMenu];
    if (!menu) return;
    
    const price = menu.price;
    const quantity = parseInt(document.getElementById('quantity').value);
    const total = calculateTotal(price, quantity);
    
    // Format dengan toLocaleString untuk menampilkan titik pemisah ribuan
    document.getElementById('totalPrice').textContent = total.toLocaleString('id-ID');
}

// Show menu popup
function showMenuPopup(menuId) {
    const menu = menuData[menuId];
    if (!menu) return;
    
    document.getElementById('popupImage').src = menu.image;
    document.getElementById('popupImage').alt = menu.name;
    document.getElementById('popupTitle').textContent = menu.name;
    document.getElementById('popupDescription').textContent = menu.description;
    document.getElementById('popupPrice').textContent = menu.price.toLocaleString('id-ID');
    
    // Reset quantity ke 1 setiap kali popup dibuka
    document.getElementById('quantity').value = 0;
    updateTotalPrice();
    
    // Set data attribute untuk mengetahui menu mana yang sedang dilihat
    menuPopup.dataset.currentMenu = menuId;
    
    menuPopup.style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}

// Show cart popup
function showCartPopup() {
    updateCartDisplay();
    cartPopup.style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}

// Close popup
function closePopup() {
    menuPopup.style.display = 'none';
    cartPopup.style.display = 'none';
    document.body.style.overflow = 'auto'; // Mengembalikan scroll
    document.documentElement.style.overflow = 'auto'; // Juga untuk html element
}

// Update cart display
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang kosong</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const menu = menuData[item.id];
        const itemTotal = calculateTotal(menu.price, item.quantity);
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${menu.image}" alt="${menu.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${menu.name}</div>
                <div class="cart-item-qty">${item.quantity} x Rp ${menu.price.toLocaleString('id-ID')}</div>
            </div>
            <div class="cart-item-price">Rp ${itemTotal.toLocaleString('id-ID')}</div>
            <button class="remove-item" data-index="${index}">Hapus</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toLocaleString('id-ID');
}

// Add to cart
function addToCart() {
    const menuId = menuPopup.dataset.currentMenu;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!menuId || quantity < 1) return;
    
    // Cek apakah item sudah ada di keranjang
    const existingItemIndex = cart.findIndex(item => item.id === menuId);
    
    if (existingItemIndex > -1) {
        // Update quantity jika sudah ada
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Tambah item baru
        cart.push({
            id: menuId,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    
    // Tampilkan konfirmasi dengan format harga yang benar
    const menu = menuData[menuId];
    const totalPrice = calculateTotal(menu.price, quantity);
    alert(`${quantity} ${menu.name} telah ditambahkan ke keranjang!\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}`);
    
    // Tutup popup
    closePopup();
}

// Remove from cart
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        updateCartDisplay();
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang masih kosong!');
        return;
    }
    
    let message = "Ringkasan Pesanan:\n\n";
    let total = 0;
    
    cart.forEach(item => {
        const menu = menuData[item.id];
        const itemTotal = calculateTotal(menu.price, item.quantity);
        total += itemTotal;
        message += `${menu.name} - ${item.quantity} x Rp ${menu.price.toLocaleString('id-ID')} = Rp ${itemTotal.toLocaleString('id-ID')}\n`;
    });
    
    message += `\nTotal: Rp ${total.toLocaleString('id-ID')}\n\n`;
    message += "Terima kasih telah berbelanja di Yummior!";
    
    alert(message);
    
    // Kosongkan keranjang
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    
    // Tutup popup keranjang
    closePopup();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Menu item click events
    document.querySelectorAll('.menu-col').forEach(item => {
        item.addEventListener('click', function() {
            const menuId = this.dataset.menu;
            showMenuPopup(menuId);
        });
    });
    
    // Quantity controls
    document.getElementById('increaseQty').addEventListener('click', function() {
        const input = document.getElementById('quantity');
        input.value = parseInt(input.value) + 1;
        updateTotalPrice();
    });
    
    document.getElementById('decreaseQty').addEventListener('click', function() {
        const input = document.getElementById('quantity');
        if (input.value > 1) {
            input.value = parseInt(input.value) - 1;
            updateTotalPrice();
        }
    });
    
    document.getElementById('quantity').addEventListener('input', updateTotalPrice);
    
    // Buy buttons
    document.getElementById('addToCart').addEventListener('click', addToCart);
    document.getElementById('buyNow').addEventListener('click', function() {
        addToCart();
        closePopup();
        setTimeout(() => showCartPopup(), 100); // Delay kecil untuk mencegah conflict
    });
    
    // Cart icon click
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        showCartPopup();
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', checkout);
    
    // Close popups
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            closePopup();
        });
    });
    
    // Close popup when clicking outside - PERBAIKAN
    window.addEventListener('click', function(e) {
        if (e.target === menuPopup || e.target === cartPopup) {
            closePopup();
        }
    });
    
    // Close popup with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
    
    // Event delegation for remove buttons in cart
    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeFromCart(index);
        }
    });
    
    // Prevent menu items from navigating when clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === '#') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
            });
        }
    });
});