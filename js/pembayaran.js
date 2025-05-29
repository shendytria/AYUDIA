document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const checkoutForm = document.getElementById('checkout-form');
    const confirmBtn = document.getElementById('confirm-btn');

    // Muat keranjang dari localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };

    // Kredensial Admin
    const adminCredentials = {
        email: "admin@gmail.com",
        password: "admin123"
    };

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
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // Format harga
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Perbarui UI keranjang
    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const checkoutTotalElement = document.getElementById('checkout-total');
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
        checkoutTotalElement.textContent = `Rp ${formatPrice(cart.total)}`;
        updateCartIndicator();
        localStorage.setItem('cart', JSON.stringify(cart));
        attachCartEventListeners();
    }

    // Perbarui indikator keranjang
    function updateCartIndicator() {
        const cartCount = cart.items.reduce((count, item) => count + item.quantity, 0);
        let cartIndicator = document.querySelector('.cart-indicator');
        const cartIcon = document.getElementById('cart-icon');
        if (!cartIndicator && cartCount > 0) {
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
            cartIndicator.textContent = cartCount > 0 ? cartCount : '';
            if (cartCount === 0) cartIndicator.remove();
        }
    }

    // Pasang event listener untuk keranjang
    function attachCartEventListeners() {
        const cartItemsContainer = document.querySelector('.cart-items');
        cartItemsContainer.addEventListener('click', function (e) {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const productId = cartItem.dataset.id;
            const productSize = cartItem.dataset.size;

            if (e.target.classList.contains('minus') || e.target.parentElement.classList.contains('minus')) {
                const input = e.target.closest('.cart-item-quantity').querySelector('.qty-input');
                let value = parseInt(input.value);
                if (value > 1) {
                    value--;
                    input.value = value;
                    updateCartItemQuantity(productId, productSize, value);
                }
            }

            if (e.target.classList.contains('plus') || e.target.parentElement.classList.contains('plus')) {
                const input = e.target.closest('.cart-item-quantity').querySelector('.qty-input');
                let value = parseInt(input.value);
                value++;
                input.value = value;
                updateCartItemQuantity(productId, productSize, value);
            }

            if (e.target.classList.contains('remove-item') || e.target.parentElement.classList.contains('remove-item')) {
                removeFromCart(productId, productSize);
                cartItem.remove();
                showNotification('Produk dihapus dari keranjang!');
            }
        });
    }

    // Perbarui jumlah item di keranjang
    function updateCartItemQuantity(productId, productSize, quantity) {
        const item = cart.items.find(item => item.id == productId && item.size === productSize);
        if (item) {
            item.quantity = quantity;
            updateCartUI();
        }
    }

    // Hapus item dari keranjang
    function removeFromCart(productId, productSize) {
        cart.items = cart.items.filter(item => !(item.id == productId && item.size === productSize));
        updateCartUI();
    }

    // Menu hamburger
    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('show');
        this.innerHTML = navLinks.classList.contains('show') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Navigasi responsif
    window.addEventListener('resize', function () {
        if (window.innerWidth > 991 && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Tambahkan gaya navigasi responsif
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
    `;
    document.head.appendChild(style);

    // Simpan transaksi ke histori
    function saveTransactionToHistory(fullName, address, phone, paymentMethod) {
        const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
        const transactionId = `TRX-${String(transactionHistory.length + 1).padStart(3, '0')}-2025`;
        const transactionDate = new Date().toISOString().split('T')[0];

        const transaction = {
            id: transactionId,
            date: transactionDate,
            status: 'success', // Asumsi pembayaran langsung sukses
            items: cart.items.map(item => ({
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            total: cart.total,
            paymentMethod: paymentMethod,
            customerInfo: {
                name: fullName,
                address: address,
                phone: phone
            }
        };

        transactionHistory.unshift(transaction);
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
    }

    // Tangani pengiriman formulir pembayaran
    checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (cart.items.length === 0) {
            showNotification('Keranjang kosong! Silakan tambahkan produk terlebih dahulu.');
            return;
        }

        const fullName = document.getElementById('full-name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const paymentMethod = document.getElementById('payment-method').value;

        if (fullName && address && phone && paymentMethod) {
            // Simpan transaksi ke histori
            saveTransactionToHistory(fullName, address, phone, paymentMethod);
            showNotification('Pembayaran berhasil dikonfirmasi!');
            // Kosongkan keranjang setelah pembayaran sukses
            cart = { items: [], total: 0 };
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            checkoutForm.reset();
            setTimeout(() => {
                window.location.href = 'historitransaksi.html';
            }, 2000);
        } else {
            showNotification('Harap lengkapi semua kolom!');
        }
    });

    // Klik tombol konfirmasi
    confirmBtn.addEventListener('click', function () {
        checkoutForm.dispatchEvent(new Event('submit'));
    });

    // Tangani pengiriman formulir login
    const loginForm = document.querySelector('.login-form');
    const loginModal = document.getElementById('login-modal');
    const overlay = document.getElementById('overlay');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;

            if (email && password) {
                if (email === adminCredentials.email && password === adminCredentials.password) {
                    showNotification('Berhasil masuk sebagai Admin!');
                    if (loginModal) loginModal.classList.remove('active');
                    if (overlay) overlay.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    this.reset();
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

    // Efek scroll header
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 80) {
            header.style.padding = '8px 24px';
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        } else {
            header.style.padding = '12px 24px';
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        }
        lastScrollTop = scrollTop;
    });

    // Inisialisasi UI keranjang
    updateCartUI();
});