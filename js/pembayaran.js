document.addEventListener('DOMContentLoaded', function () {
    // Elemen UI
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const checkoutForm = document.getElementById('checkout-form');
    const confirmBtn = document.getElementById('confirm-btn');
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    const courierSelect = document.getElementById('courier');
    const paymentMethodSelect = document.getElementById('payment-method');
    const bankTransferDetails = document.getElementById('bank-transfer-details');
    const creditCardDetails = document.getElementById('credit-card-details');
    const eWalletDetails = document.getElementById('e-wallet-details');

    // Muat keranjang dari localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0, shippingCost: 0 };

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
        const cartItemsContainers = document.querySelectorAll('.cart-items');
        const checkoutSubtotalElement = document.getElementById('checkout-subtotal');
        const checkoutShippingElement = document.getElementById('checkout-shipping');
        const checkoutTotalElement = document.getElementById('checkout-total');
        const cartTotalElement = document.querySelector('.cart-total span:last-child');
        cartItemsContainers.forEach(container => container.innerHTML = '');
        cart.total = 0;

        if (cart.items.length === 0) {
            cartItemsContainers.forEach(container => {
                container.innerHTML = '<p class="empty-cart">Keranjang kamu kosong.</p>';
            });
        } else {
            cart.items.forEach(item => {
                cart.total += item.price * item.quantity;
                const cartItemHTML = `
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
                cartItemsContainers.forEach(container => container.innerHTML += cartItemHTML);
            });
        }
        if (checkoutSubtotalElement) {
            checkoutSubtotalElement.textContent = `Rp ${formatPrice(cart.total)}`;
        }
        if (checkoutShippingElement) {
            checkoutShippingElement.textContent = `Rp ${formatPrice(cart.shippingCost)}`;
        }
        if (checkoutTotalElement) {
            checkoutTotalElement.textContent = `Rp ${formatPrice(cart.total + cart.shippingCost)}`;
        }
        if (cartTotalElement) {
            cartTotalElement.textContent = `Rp ${formatPrice(cart.total)}`;
        }
        updateCartIndicator();
        localStorage.setItem('cart', JSON.stringify(cart));
        attachCartEventListeners();
    }

    // Perbarui indikator keranjang
    function updateCartIndicator() {
        const cartCount = cart.items.reduce((count, item) => count + item.quantity, 0);
        let cartIndicator = document.querySelector('.cart-indicator');
        if (!cartIndicator && cartCount > 0 && cartIcon) {
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
        const cartItemsContainers = document.querySelectorAll('.cart-items');
        cartItemsContainers.forEach(container => {
            container.addEventListener('click', function (e) {
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
                    showNotification('Produk dihapus dari keranjang!');
                }
            });
        });
    }

    // Perbarui jumlah item keranjang
    function updateCartItemQuantity(productId, size, quantity) {
        const item = cart.items.find(item => item.id === productId && item.size === size);
        if (item) {
            item.quantity = quantity;
            updateCartUI();
        }
    }

    // Hapus item dari keranjang
    function removeFromCart(productId, productSize) {
        cart.items = cart.items.filter(item => !(item.id === productId && item.size === productSize));
        updateCartUI();
    }

    // Event listener untuk sidebar keranjang
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

        const checkoutBtn = cartSidebar.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function () {
                if (cart.items.length === 0) {
                    showNotification('Keranjang kosong! Silakan tambahkan produk terlebih dahulu.');
                    return;
                }
                window.location.href = 'pembayaran.html';
                cartSidebar.classList.remove('active');
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
    } else {
        console.error('Cart sidebar elements not found:', { cartIcon, cartSidebar, closeCart, overlay });
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

    // Simpan transaksi ke histori
    function saveTransactionToHistory(fullName, address, phone, paymentMethod, courier) {
        const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
        const transactionId = `TRX-${String(transactionHistory.length + 1).padStart(3, '0')}-2025`;
        const transactionDate = new Date().toISOString().split('T')[0];

        const transaction = {
            id: transactionId,
            date: transactionDate,
            status: 'success',
            items: cart.items.map(item => ({
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            total: cart.total + cart.shippingCost,
            shippingCost: cart.shippingCost,
            courier: courier,
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

    // Tangani perubahan kurir
    if (courierSelect) {
        courierSelect.addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            cart.shippingCost = parseInt(selectedOption.dataset.cost || 0);
            updateCartUI();
        });
    }

    // Tangani perubahan metode pembayaran
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', function () {
            bankTransferDetails.style.display = 'none';
            creditCardDetails.style.display = 'none';
            eWalletDetails.style.display = 'none';

            if (this.value === 'bank-transfer') {
                bankTransferDetails.style.display = 'block';
            } else if (this.value === 'credit-card') {
                creditCardDetails.style.display = 'block';
            } else if (this.value === 'e-wallet') {
                eWalletDetails.style.display = 'block';
            }
        });
    }

    // Validasi input kartu kredit
    function validateCreditCard() {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvc = document.getElementById('card-cvc').value;

        if (!/^\d{16}$/.test(cardNumber)) {
            showNotification('Nomor kartu kredit harus 16 digit.');
            return false;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
            showNotification('Tanggal kadaluarsa harus dalam format MM/YY.');
            return false;
        }
        if (!/^\d{3}$/.test(cardCvc)) {
            showNotification('CVC harus 3 digit.');
            return false;
        }
        return true;
    }

    // Tangani pengiriman formulir pembayaran
    if (checkoutForm && confirmBtn) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (cart.items.length === 0) {
                showNotification('Keranjang kosong! Silakan tambahkan produk terlebih dahulu.');
                return;
            }

            const fullName = document.getElementById('full-name').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const courier = document.getElementById('courier').value;
            const paymentMethod = document.getElementById('payment-method').value;

            if (!fullName || !address || !phone || !courier || !paymentMethod) {
                showNotification('Harap lengkapi semua kolom!');
                return;
            }

            if (paymentMethod === 'credit-card' && !validateCreditCard()) {
                return;
            }

            if (paymentMethod === 'bank-transfer') {
                const proof = document.getElementById('bank-transfer-proof').files.length;
                if (proof === 0) {
                    showNotification('Harap unggah bukti transfer.');
                    return;
                }
            }

            saveTransactionToHistory(fullName, address, phone, paymentMethod, courier);
            showNotification('Pembayaran berhasil dikonfirmasi!');
            cart = { items: [], total: 0, shippingCost: 0 };
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
            checkoutForm.reset();
            bankTransferDetails.style.display = 'none';
            creditCardDetails.style.display = 'none';
            eWalletDetails.style.display = 'none';
            setTimeout(() => {
                window.location.href = 'historitransaksi.html';
            }, 2000);
        });

        confirmBtn.addEventListener('click', function () {
            checkoutForm.dispatchEvent(new Event('submit'));
        });
    }

    // Efek scroll header
    const header = document.querySelector('header');
    if (header) {
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
    }

    // Inisialisasi UI keranjang
    updateCartUI();

    // Format input kartu kredit
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }

    // Format input tanggal kadaluarsa
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value.slice(0, 5);
        });
    }
});

document.getElementById("login-icon").addEventListener("click", function () {
    window.location.href = "login.html";
});