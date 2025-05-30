document.addEventListener('DOMContentLoaded', function () {
    // Elemen UI
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const transactionsContainer = document.getElementById('transactions-container');
    const applyFilterBtn = document.getElementById('apply-filter');
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');
    const statusFilter = document.getElementById('status-filter');
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');

    // Muat data dari localStorage
    let transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
    let filteredTransactions = [...transactionHistory];
    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };

    // Format harga
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

    // Format tanggal dan waktu
    function formatDate(dateString) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Jakarta',
            timeZoneName: 'short'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    // Dapatkan waktu WIB
    function getCurrentWIBTime() {
        const now = new Date();
        const wibString = now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
        return new Date(wibString).toISOString();
    }

    // Tampilkan notifikasi
    function showNotification(message) {
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // Tambah ke keranjang
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

        updateCartUI();
        showNotification(`${product.name} (Ukuran: ${size}) ditambahkan ke keranjang!`);
    }

    // Hapus dari keranjang
    function removeFromCart(productId, size) {
        cart.items = cart.items.filter(item => !(item.id === productId && item.size === size));
        updateCartUI();
        showNotification('Item dihapus dari keranjang!');
    }

    // Perbarui jumlah item keranjang
    function updateCartItemQuantity(productId, size, quantity) {
        const item = cart.items.find(item => item.id === productId && item.size === size);
        if (item) {
            item.quantity = quantity;
            updateCartUI();
        }
    }

    // Perbarui UI keranjang
    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalElement = document.getElementById('cart-total');
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

    // Perbarui indikator keranjang
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

    // Pasang event listener keranjang
    function attachCartEventListeners() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;

        cartItemsContainer.addEventListener('click', function (e) {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const productId = parseInt(cartItem.dataset.id);
            const size = cartItem.dataset.size;

            if (e.target.closest('.remove-item')) {
                removeFromCart(productId, size);
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

    // Event listener sidebar keranjang
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

    // Tambahkan transaksi baru
    function addTransaction(transactionData) {
        const currentTime = getCurrentWIBTime();
        const timestamp = Date.now();

        const newTransaction = {
            id: `TRX-${timestamp}-${new Date().getFullYear()}`,
            date: currentTime,
            createdAt: currentTime,
            status: transactionData.status || 'pending',
            items: transactionData.items,
            total: transactionData.total,
            paymentMethod: transactionData.paymentMethod,
            customerInfo: transactionData.customerInfo || {}
        };

        transactionHistory.unshift(newTransaction);
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
        filteredTransactions = [...transactionHistory];
        renderTransactions();
        showNotification(`Transaksi ${newTransaction.id} berhasil dicatat pada ${formatDate(currentTime)}`);

        return newTransaction;
    }

    // Update status transaksi
    function updateTransactionStatus(transactionId, newStatus) {
        const index = transactionHistory.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            transactionHistory[index].status = newStatus;
            transactionHistory[index].updatedAt = getCurrentWIBTime();
            localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
            filteredTransactions = [...transactionHistory];
            renderTransactions();
            showNotification(`Status transaksi ${transactionId} diubah menjadi ${newStatus === 'success' ? 'Berhasil' : 'Menunggu'}`);
        }
    }

    // Buat badge status
    function getStatusBadge(status) {
        const statusClass = status === 'success' ? 'status-success' : 'status-pending';
        const statusText = status === 'success' ? 'Berhasil' : 'Menunggu';
        const statusIcon = status === 'success' ? 'fa-check-circle' : 'fa-clock';
        return `<span class="transaction-status ${statusClass}">
            <i class="fas ${statusIcon}"></i> ${statusText}
        </span>`;
    }

    // Buat kartu transaksi
    function generateTransactionCard(transaction) {
        const itemsHTML = transaction.items.map(item => `
            <div class="transaction-item">
                <div class="item-image">
                    ${item.image ?
                `<img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <i class="fas fa-tshirt" style="display:none;"></i>` :
                `<i class="fas fa-tshirt"></i>`}
                </div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">
                        <span><i class="fas fa-tag"></i> Ukuran: ${item.size}</span>
                        <span><i class="fas fa-sort-numeric-up"></i> Qty: ${item.quantity}</span>
                    </div>
                </div>
                <div class="item-price">Rp ${formatPrice(item.price)}</div>
            </div>
        `).join('');

        return `
            <div class="transaction-card" data-transaction-id="${transaction.id}">
                <div class="transaction-header">
                    <div class="transaction-info">
                        <div class="transaction-id">
                            <i class="fas fa-receipt"></i> ${transaction.id}
                        </div>
                        <div class="transaction-date">
                            <i class="fas fa-calendar"></i> ${formatDate(transaction.date)}
                        </div>
                    </div>
                    ${getStatusBadge(transaction.status)}
                </div>
                <div class="transaction-details">
                    <div class="transaction-items">${itemsHTML}</div>
                    <div class="transaction-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>Rp ${formatPrice(transaction.total)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Metode Pembayaran:</span>
                            <span>${transaction.paymentMethod}</span>
                        </div>
                        <div class="summary-row">
                            <span>Total:</span>
                            <span>Rp ${formatPrice(transaction.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Tampilkan state kosong
    function showEmptyState() {
        transactionsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>Belum Ada Transaksi</h3>
                <p>Anda belum memiliki riwayat transaksi. Mulai berbelanja sekarang dan nikmati koleksi kebaya terbaik kami!</p>
                <a href="koleksi.html" class="empty-state-btn">
                    <i class="fas fa-shopping-cart"></i> Mulai Belanja
                </a>
            </div>
        `;
    }

    // Render transaksi
    function renderTransactions(transactions = filteredTransactions) {
        if (transactions.length === 0) {
            showEmptyState();
            return;
        }

        const transactionsHTML = transactions.map(generateTransactionCard).join('');
        transactionsContainer.innerHTML = transactionsHTML;

        setTimeout(() => {
            const cards = document.querySelectorAll('.transaction-card');
            cards.forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.4s ease';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            });
        }, 50);
    }

    // Filter transaksi
    function filterTransactions() {
        const dateFrom = dateFromInput.value;
        const dateTo = dateToInput.value;
        const status = statusFilter.value;

        filteredTransactions = transactionHistory.filter(transaction => {
            let matchesDate = true;
            let matchesStatus = true;

            if (dateFrom || dateTo) {
                const transactionDate = new Date(transaction.date);
                if (dateFrom) {
                    const fromDate = new Date(dateFrom + 'T00:00:00+07:00');
                    matchesDate = matchesDate && transactionDate >= fromDate;
                }
                if (dateTo) {
                    const toDate = new Date(dateTo + 'T23:59:59+07:00');
                    matchesDate = matchesDate && transactionDate <= toDate;
                }
            }

            if (status) {
                matchesStatus = transaction.status === status;
            }

            return matchesDate && matchesStatus;
        });

        renderTransactions(filteredTransactions);
        const message = filteredTransactions.length > 0
            ? `${filteredTransactions.length} transaksi ditemukan`
            : 'Tidak ada transaksi yang sesuai dengan filter';
        showNotification(message);
    }

    // Reset filter
    function resetFilters() {
        dateFromInput.value = '';
        dateToInput.value = '';
        statusFilter.value = '';
        filteredTransactions = [...transactionHistory];
        renderTransactions();
    }

    // Tampilkan state loading
    function showLoadingState() {
        const original = applyFilterBtn.innerHTML;
        applyFilterBtn.innerHTML = '<div class="loading-spinner"></div> Memuat...';
        applyFilterBtn.disabled = true;
        setTimeout(() => {
            applyFilterBtn.innerHTML = original;
            applyFilterBtn.disabled = false;
        }, 1000);
    }

    // Event listener filter
    if (applyFilterBtn && dateFromInput && dateToInput && statusFilter) {
        applyFilterBtn.addEventListener('click', () => {
            showLoadingState();
            setTimeout(filterTransactions, 1000);
        });

        [dateFromInput, dateToInput, statusFilter].forEach(input => {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    showLoadingState();
                    setTimeout(filterTransactions, 1000);
                }
            });
        });
    }

    // Hamburger menu
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Dapatkan tanggal WIB
    function getWIBDateString(date) {
        return date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
    }

    // Inisialisasi halaman
    function initializePage() {
        const now = new Date();
        const todayWIB = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        dateToInput.value = getWIBDateString(todayWIB);
        renderTransactions();
        window.addTransaction = addTransaction;
        updateCartUI();
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Sticky header
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

    // Inisialisasi
    initializePage();
});
document.getElementById("login-icon").addEventListener("click", function () {
    window.location.href = "login.html";
});