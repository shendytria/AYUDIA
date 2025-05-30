
document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Sidebar Keranjang
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');

    // Inisialisasi keranjang dari localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };

    // Pastikan data di localStorage valid
    if (!Array.isArray(cart.items)) {
        cart = { items: [], total: 0 };
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Event Listener untuk Keranjang
    if (cartIcon && cartSidebar && closeCart && overlay) {
        cartIcon.addEventListener('click', function () {
            cartSidebar.classList.add('active');
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            updateCartUI();
        });

        closeCart.addEventListener('click', function () {
            cartSidebar.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        overlay.addEventListener('click', function () {
            cartSidebar.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    } else {
        console.error('Cart elements not found:', { cartIcon, cartSidebar, closeCart, overlay });
    }

    // Toggle Menu Mobile
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('show');
            this.innerHTML = navLinks.classList.contains('show') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 991 && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    } else {
        console.error('Mobile menu elements not found:', { hamburger, navLinks });
    }

    // Tambah CSS untuk menu mobile dan modal quick view
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
            .nav-links.show li { margin: 8px 0; }
        }
        .size-btn {
            padding: 6px 12px;
            margin: 4px;
            border: 1px solid #D3D3D3;
            border-radius: 4px;
            background-color: #FFFFFF;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .size-btn.selected {
            background-color: #9B7E46;
            color: #FFFFFF;
            border-color: #9B7E46;
        }
        .quick-view-content {
            display: flex;
            gap: 16px;
            padding: 16px;
        }
        .quick-view-img img {
            width: 100%;
            max-width: 300px;
            border-radius: 8px;
        }
        .quick-view-info {
            flex: 1;
        }
        .quick-view-title {
            font-size: 20px;
            margin-bottom: 8px;
        }
        .quick-view-price {
            font-size: 18px;
            font-weight: 600;
            color: #2B2B2B;
            margin-bottom: 8px;
        }
        .quick-view-description {
            font-size: 14px;
            margin-bottom: 12px;
        }
        .quick-view-category {
            font-size: 14px;
            color: #6B6B6B;
            margin-bottom: 12px;
        }
        .quick-view-sizes label {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            display: block;
        }
        .size-options {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }
        .quick-view-actions {
            margin-top: 16px;
        }
        .add-to-cart-quick {
            width: 100%;
            padding: 12px;
            background-color: #2B2B2B;
            color: #FFFFFF;
            border: none;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
        }
        .add-to-cart-quick:hover {
            background-color: #9B7E46;
        }
    `;
    document.head.appendChild(style);

    // Format Price Function
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Fungsi Tambah ke Keranjang
    function addToCart(product) {
        const size = product.size || 'N/A';
        const existingItem = cart.items.find(item => item.id === product.id && item.size === size);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                size: size
            });
        }

        // Perbarui total dan simpan ke localStorage
        cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showNotification(`${product.name} (Ukuran: ${size}) ditambahkan ke keranjang!`);
        cartSidebar.classList.add('active');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Fungsi Hapus dari Keranjang
    function removeFromCart(productId, size) {
        cart.items = cart.items.filter(item => !(item.id === productId && item.size === size));
        // Perbarui total dan simpan ke localStorage
        cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        showNotification('Item dihapus dari keranjang!');
    }

    // Perbarui Kuantitas Item Keranjang
    function updateCartItemQuantity(productId, size, quantity) {
        const item = cart.items.find(item => item.id === productId && item.size === size);
        if (item && quantity >= 1) {
            item.quantity = quantity;
            // Perbarui total dan simpan ke localStorage
            cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        }
    }

    // Perbarui UI Keranjang
    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalElement = document.querySelector('.cart-total span:last-child');
        if (!cartItemsContainer || !cartTotalElement) {
            console.error('Cart UI elements not found');
            return;
        }
        cartItemsContainer.innerHTML = '';
        cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang kamu kosong.</p>';
        } else {
            cart.items.forEach(item => {
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
        localStorage.setItem('cart', JSON.stringify(cart));
        attachCartEventListeners();
    }

    // Perbarui Indikator Keranjang
    function updateCartIndicator() {
        const cartCount = cart.items.reduce((count, item) => count + item.quantity, 0);
        let cartIndicator = document.querySelector('.cart-indicator');
        if (!cartIndicator && cartCount > 0 && cartIcon) {
            cartIndicator = document.createElement('span');
            cartIndicator.className = 'cart-indicator';
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
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(cartIndicator);
        }
        if (cartIndicator) {
            cartIndicator.textContent = cartCount > 0 ? cartCount : '';
            if (cartCount === 0) cartIndicator.remove();
        }
    }

    // Attach Cart Event Listeners
    function attachCartEventListeners() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) {
            console.error('Cart items container not found');
            return;
        }
        cartItemsContainer.addEventListener('click', function (e) {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const productId = parseInt(cartItem.dataset.id);
            const size = cartItem.dataset.size;

            if (e.target.closest('.remove-item')) {
                const item = cart.items.find(item => item.id === productId && item.size === size);
                if (item) {
                    removeFromCart(productId, size);
                    showNotification(`${item.name} (Ukuran: ${item.size}) dihapus dari keranjang!`);
                }
            } else if (e.target.classList.contains('minus')) {
                const item = cart.items.find(item => item.id === productId && item.size === size);
                if (item && item.quantity > 1) {
                    updateCartItemQuantity(productId, size, item.quantity - 1);
                }
            } else if (e.target.classList.contains('plus')) {
                const item = cart.items.find(item => item.id === productId && item.size === size);
                if (item) {
                    updateCartItemQuantity(productId, size, item.quantity + 1);
                }
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

    // Validasi Formulir Register
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = this.querySelector('input[placeholder="Nama Lengkap"]').value.trim();
            const email = this.querySelector('input[placeholder="Email Kamu"]').value.trim();
            const password = this.querySelector('input[placeholder="Kata Sandi"]').value;
            const confirmPassword = this.querySelector('input[placeholder="Konfirmasi Kata Sandi"]').value;

            // Validasi input
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Harap isi semua kolom.');
                return;
            }

            // Validasi format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Harap masukkan email yang valid.');
                return;
            }

            // Validasi panjang kata sandi
            if (password.length < 6) {
                showNotification('Kata sandi harus minimal 6 karakter.');
                return;
            }

            // Validasi konfirmasi kata sandi
            if (password !== confirmPassword) {
                showNotification('Kata sandi dan konfirmasi kata sandi tidak cocok.');
                return;
            }

            // Simulasi pendaftaran berhasil
            showNotification('Pendaftaran berhasil! Silakan masuk untuk melanjutkan.');
            this.reset();
        });
    }

    // Inisialisasi UI Keranjang
    updateCartUI();

    // Login Icon Redirect
    const loginIcon = document.getElementById('login-icon');
    if (loginIcon) {
        loginIcon.addEventListener('click', function () {
            window.location.href = 'login.html';
        });
    }
});
