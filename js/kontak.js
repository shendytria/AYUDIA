// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Modal Login
const loginIcon = document.getElementById('login-icon');
const closeModal = document.getElementById('close-modal');
const loginModal = document.getElementById('login-modal');

let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };

// FAQ Toggle
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');
        question.classList.toggle('active', !isActive);
        answer.classList.toggle('show', !isActive);
    });
});

// Sidebar Keranjang
const cartIcon = document.getElementById('cart-icon');
const closeCart = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');

cartIcon.addEventListener('click', function () {
    cartSidebar.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeCart.addEventListener('click', function () {
    cartSidebar.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Format Price Function
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Fungsi Tambah ke Keranjang
function addToCart(product) {
    const existingItem = cart.items.find(item => item.id === product.id && item.size === product.size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            size: product.size || 'N/A'
        });
    }

    updateCartUI();
    showNotification(`${product.name} (Ukuran: ${product.size || 'N/A'}) ditambahkan ke keranjang!`);
    cartSidebar.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fungsi Hapus dari Keranjang
function removeFromCart(productId, size) {
    cart.items = cart.items.filter(item => !(item.id === productId && item.size === size));
    updateCartUI();
    showNotification('Item dihapus dari keranjang!');
}

// Perbarui Kuantitas Item Keranjang
function updateCartItemQuantity(productId, quantity) {
    const item = cart.items.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        updateCartUI();
    }
}

// Hitung Total Keranjang
function calculateCartTotal() {
    return cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Perbarui UI Keranjang
function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total span:last-child');
    cartItemsContainer.innerHTML = '';
    cart.total = 0;

    if (cart.items.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang kamu kosong.</p>';
    } else {
        cart.items.forEach(item => {
            cart.total += item.price * item.quantity;
            cartItemsContainer.innerHTML += `
                <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}" />
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">Rp ${formatPrice(item.price)}</p>
                        <p class="cart-item-size">Ukuran: ${item.size}</p>
                        <div class="cart-item-quantity">
                            <button class="qty-btn minus">-</button>
                            <input type="text" class="qty-input" value="${item.quantity}" readonly>
                            <button class="qty-btn plus">+</button>
                        </div>
                    </div>
                    <span class="remove-item"><i class="fas fa-trash-alt"></i></span>
                </div>
            `;
        });
    }
    cartTotalElement.textContent = `Rp ${formatPrice(cart.total)}`;
    updateCartIndicator();
    localStorage.setItem('cart', JSON.stringify(cart)); // Simpan keranjang ke localStorage
    attachCartEventListeners();
}

// Perbarui Indikator Keranjang
function updateCartIndicator() {
    const cartCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    let cartIndicator = document.querySelector('.cart-indicator');
    if (!cartIndicator && cartCount > 0) {
        const cartIcon = document.getElementById('cart-icon');
        cartIndicator = document.createElement('span');
        cartIndicator.className = 'cart-indicator';
        cartIcon.style.position = 'relative';
        cartIndicator.style.position = 'absolute';
        cartIndicator.style.top = '-6px';
        cartIndicator.style.right = '-6px';
        cartIndicator.style.backgroundColor = '#4A2C2A';
        cartIndicator.style.color = '#FFFFFF';
        cartIndicator.style.borderRadius = '50%';
        cartIndicator.style.width = '14px';
        cartIndicator.style.height = '14px';
        cartIndicator.style.fontSize = '9px';
        cartIndicator.style.display = 'flex';
        cartIndicator.style.alignItems = 'center';
        cartIndicator.style.justifyContent = 'center';
        cartIcon.appendChild(cartIndicator);
    }

    if (cartIndicator) {
        if (cartCount > 0) {
            cartIndicator.textContent = cartCount;
        } else {
            cartIndicator.remove();
        }
    }
}

// Attach Cart Event Listeners
function attachCartEventListeners() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.addEventListener('click', function (e) {
        const cartItem = e.target.closest('.cart-item');
        if (!cartItem) return;

        const productId = parseInt(cartItem.dataset.id);
        const size = cartItem.dataset.size;

        if (e.target.closest('.remove-item')) {
            const item = cart.items.find(item => item.id === productId && item.size === size);
            if (item) {
                cart.items = cart.items.filter(i => !(i.id === productId && i.size === size));
                updateCartUI();
                showNotification(`${item.name} (Ukuran: ${item.size}) dihapus dari keranjang!`);
            }
        } else if (e.target.classList.contains('minus')) {
            const item = cart.items.find(item => item.id === productId && item.size === size);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                updateCartUI();
            }
        } else if (e.target.classList.contains('plus')) {
            const item = cart.items.find(item => item.id === productId && item.size === size);
            if (item) {
                item.quantity += 1;
                updateCartUI();
            }
        }
    });
}

// Fungsi Login
loginIcon.addEventListener('click', function () {
    loginModal.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', function () {
    loginModal.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Tutup saat overlay diklik
overlay.addEventListener('click', function () {
    cartSidebar.classList.remove('active');
    loginModal.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Kredensial Admin
const adminCredentials = {
    email: "admin@gmail.com",
    password: "admin123"
};

// Toggle Menu Mobile
hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('show');
    this.innerHTML = navLinks.classList.contains('show') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Tangani resize window
window.addEventListener('resize', function () {
    if (window.innerWidth > 991 && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Tambah CSS untuk menu mobile
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 991px) {
        .nav-links.show {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 60px;
            left: 0;
            width: 100%;
            background-color: #FFFFFF;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 16px;
            z-index: 1000;
        }
        
        .nav-links.show li {
            margin: 8px 0;
        }
    }
`;
document.head.appendChild(style);

// Tampilkan Modal Lihat Cepat
function showQuickView(product) {
    let quickViewModal = document.getElementById('quick-view-modal');
    if (!quickViewModal) {
        quickViewModal = document.createElement('div');
        quickViewModal.id = 'quick-view-modal';
        quickViewModal.className = 'login-modal';
        quickViewModal.style.maxWidth = '720px';
        quickViewModal.style.width = '90%';
        document.body.appendChild(quickViewModal);
    }

    quickViewModal.innerHTML = `
        <div class="modal-header">
            <h3 class="modal-title">Detail Produk</h3>
            <span class="close-modal" id="close-quick-view"><i class="fas fa-times"></i></span>
        </div>
        <div class="quick-view-content">
            <div class="quick-view-img">
                <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="quick-view-info">
                <h3 class="quick-view-title">${product.name}</h3>
                <p class="quick-view-price">Rp ${formatPrice(product.price)}</p>
                <p class="quick-view-description">${product.description}</p>
                <p class="quick-view-category">Kategori: ${product.category}</p>
                <div class="quick-view-sizes">
                    <label>Pilih Ukuran:</label>
                    <div class="size-options">
                        <button class="size-btn" data-size="XS">XS</button>
                        <button class="size-btn" data-size="S">S</button>
                        <button class="size-btn" data-size="M">M</button>
                        <button class="size-btn" data-size="L">L</button>
                        <button class="size-btn" data-size="XL">XL</button>
                    </div>
                </div>
                <div class="quick-view-actions">
                    <button class="about-btn add-to-cart-quick" data-id="${product.id}">Tambah ke Keranjang</button>
                </div>
            </div>
        </div>
    `;

    quickViewModal.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Size selection logic
    const sizeButtons = quickViewModal.querySelectorAll('.size-btn');
    let selectedSize = null;

    sizeButtons.forEach(button => {
        button.addEventListener('click', function () {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedSize = this.dataset.size;
        });
    });

    // Close modal
    document.getElementById('close-quick-view').addEventListener('click', function () {
        quickViewModal.classList.remove('active');
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Add to cart
    document.querySelector('.add-to-cart-quick').addEventListener('click', function () {
        if (!selectedSize) {
            showNotification('Silakan pilih ukuran terlebih dahulu!');
            return;
        }
        const productId = parseInt(this.dataset.id);
        const product = products.find(p => p.id === productId);
        if (product) {
            const cartItem = {
                ...product,
                size: selectedSize
            };
            addToCart(cartItem);
            quickViewModal.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Tampilkan Notifikasi
function showNotification(message) {
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '16px';
        notificationContainer.style.right = '16px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.backgroundColor = 'rgba(74, 44, 42, 0.95)';
    notification.style.color = '#FFFFFF';
    notification.style.padding = '10px 16px';
    notification.style.borderRadius = '4px';
    notification.style.marginTop = '8px';
    notification.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    notification.style.transform = 'translateY(16px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        notification.style.transform = 'translateY(-16px)';
        notification.style.opacity = '0';

        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}

// Validasi Formulir
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = this.querySelector('input[placeholder="Nama Kamu"]').value;
        const email = this.querySelector('input[placeholder="Email Kamu"]').value;

        if (name && email) {
            showNotification('Pesan kamu telah terkirim! Kami akan segera menghubungi.');
            this.reset();
        }
    });
}

// Validasi Formulir Login
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        if (email && password) {
            if (email === adminCredentials.email && password === adminCredentials.password) {
                showNotification('Berhasil masuk sebagai Admin!');
                loginModal.classList.remove('active');
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.reset();
                // Redirect to dashboard.html
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showNotification('Email atau kata sandi salah. Silakan coba lagi.');
            }
        } else {
            showNotification('Harap isi email dan kata sandi.');
        }
    });
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = this.querySelector('.newsletter-input').value;

        if (email) {
            showNotification('Terima kasih telah berlangganan!');
            this.reset();
        }
    });
}

// Initialize cart UI on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});