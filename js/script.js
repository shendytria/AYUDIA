document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Keranjang
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');

    // Menu Mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Data Produk
    const products = [
        {
            id: 1,
            name: 'Kebaya Encim Bordir Biru',
            price: 749000,
            image: 'https://dynamic.zacdn.com/MbHhIGJgvN2qQF74MCglismMM_Q=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/soraya-kebaya-4554-1212203-1.jpg',
            description: 'Kebaya modern dengan motif bordir bunga biru yang anggun, dipadukan dengan rok lilit navy. Cocok untuk acara formal maupun semi-formal.',
            category: 'Kebaya Kutubaru'
        },
        {
            id: 2,
            name: 'Kebaya Pink Bordir Mawar',
            price: 875000,
            image: 'https://dynamic.zacdn.com/dfDKfU4zE6y0qph0s92V15Adzzo=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/maslea-5885-2210264-1.jpg',
            description: 'Kebaya encim berwarna pink lembut dengan detail bordir bunga mawar di bagian lengan dan kerah, memberikan kesan feminin dan elegan.',
            category: 'Kebaya Kutubaru'
        },
        {
            id: 3,
            name: 'Kebaya Brokat Putih Lengan Pendek',
            price: 695000,
            image: 'https://i.pinimg.com/736x/29/83/03/2983036f793885b33421cb13ad672cd2.jpg',
            description: 'Kebaya brokat transparan lengan pendek dengan motif bunga besar kontras, cocok untuk gaya kasual etnik yang chic.',
            category: 'Kebaya Kutubaru'
        },
        {
            id: 4,
            name: 'Kebaya Organza Motif Bunga Soft Beige',
            price: 920000,
            image: 'https://i.pinimg.com/736x/d2/6c/12/d26c12d483da10d5f4b0a2d7ce327f02.jpg',
            description: 'Kebaya organza semi-transparan dengan warna beige dan motif floral lembut. Model lengan balon ¾ menambah kesan anggun.',
            category: 'Kebaya Kutubaru'
        }
    ];

    // Data Keranjang
    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };

    // Fungsi Keranjang
    if (cartIcon && cartSidebar && closeCart && overlay) {
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

        overlay.addEventListener('click', function () {
            cartSidebar.classList.remove('active');
            const quickViewModal = document.getElementById('quick-view-modal');
            if (quickViewModal) quickViewModal.classList.remove('active');
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
    }

    // Tambah CSS untuk menu mobile
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 991px) {
            .nav-links.show {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 80px;
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

    // Tombol Kuantitas
    document.addEventListener('click', function (e) {
        // Tombol Minus
        if (e.target.classList.contains('minus')) {
            const input = e.target.nextElementSibling;
            let value = parseInt(input.value);
            if (value > 1) {
                value--;
                input.value = value;
                const cartItem = e.target.closest('.cart-item');
                if (cartItem) {
                    const productId = parseInt(cartItem.dataset.id);
                    const productSize = cartItem.dataset.size;
                    updateCartItemQuantity(productId, productSize, value);
                }
            }
        }

        // Tombol Plus
        if (e.target.classList.contains('plus')) {
            const input = e.target.previousElementSibling;
            let value = parseInt(input.value);
            value++;
            input.value = value;
            const cartItem = e.target.closest('.cart-item');
            if (cartItem) {
                const productId = parseInt(cartItem.dataset.id);
                const productSize = cartItem.dataset.size;
                updateCartItemQuantity(productId, productSize, value);
            }
        }

        // Hapus Item
        if (e.target.classList.contains('remove-item') || e.target.parentElement.classList.contains('remove-item')) {
            const cartItem = e.target.closest('.cart-item');
            if (cartItem) {
                const productId = parseInt(cartItem.dataset.id);
                const productSize = cartItem.dataset.size;

                // Temukan item dari cart berdasarkan ID dan size
                const item = cart.items.find(item => item.id === productId && item.size === productSize);

                removeFromCart(productId, productSize);
                cartItem.remove();

                if (item) {
                    showNotification(`${item.name} (Ukuran: ${item.size}) dihapus dari keranjang!`);
                } else {
                    showNotification('Produk dihapus dari keranjang!');
                }
            }
        }

        // Tambah ke Keranjang
        if (e.target.classList.contains('add-to-cart') || e.target.parentElement.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.dataset.id);
                const product = products.find(p => p.id === productId);
                if (product) {
                    showQuickView(product); // Buka modal untuk memilih ukuran
                }
            }
        }

        // Lihat Cepat
        if (e.target.classList.contains('quick-view') || e.target.parentElement.classList.contains('quick-view')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.dataset.id);
                const product = products.find(p => p.id === productId);
                if (product) {
                    showQuickView(product);
                }
            }
        }
    });

    // Inisialisasi kartu produk dengan atribut data
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        if (products[index]) {
            card.dataset.id = products[index].id;
        }
    });

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
        updateCartUI();
        showNotification(`${product.name} (Ukuran: ${size}) ditambahkan ke keranjang!`);
        if (cartSidebar && overlay) {
            cartSidebar.classList.add('active');
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Cannot open cart sidebar: elements not found');
        }
    }

    // Fungsi Hapus dari Keranjang
    function removeFromCart(productId, productSize) {
        cart.items = cart.items.filter(item => !(item.id === productId && item.size === productSize));
        updateCartUI();
    }

    // Perbarui Kuantitas Item Keranjang
    function updateCartItemQuantity(productId, productSize, quantity) {
        const item = cart.items.find(item => item.id === productId && item.size === productSize);
        if (item) {
            item.quantity = quantity;
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
    }

    // Perbarui Indikator Keranjang
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
                    <a href="assets/size-chart.jpg" target="_blank" class="size-chart-link">Cek Detail Size</a>
                    <div class="quick-view-actions">
                        <button class="add-to-cart-quick" data-id="${product.id}">Tambah ke Keranjang</button>
                    </div>
                </div>
            </div>
        `;

        quickViewModal.classList.add('active');
        if (overlay) {
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

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
        const closeQuickView = quickViewModal.querySelector('#close-quick-view');
        if (closeQuickView) {
            closeQuickView.addEventListener('click', function () {
                quickViewModal.classList.remove('active');
                if (overlay) {
                    overlay.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }

        // Add to cart
        const addToCartQuick = quickViewModal.querySelector('.add-to-cart-quick');
        if (addToCartQuick) {
            addToCartQuick.addEventListener('click', function () {
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
                    if (overlay) {
                        overlay.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                }
            });
        }
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

    // Validasi Formulir Kontak
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

    // Validasi Formulir Newsletter
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

    // Animasi Scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;

            if (elementTop < window.innerHeight - 80 && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    fadeInOnScroll();
    window.addEventListener('scroll', fadeInOnScroll);

    // Scroll Halus
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (navLinks && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                if (hamburger) {
                    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Format price with thousand separator
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Sticky Header
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

    // Initialize
    updateCartUI();

    // Encim Card Animations
    const cards = document.querySelectorAll('.encim-card');
    cards.forEach(card => {
        const rotation = card.getAttribute('data-rotate');
        if (rotation) {
            card.style.transform = `rotate(${rotation}deg)`;
        }
        const index = Array.from(cards).indexOf(card);
        card.style.animationDelay = `${index * 0.2}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.3 });

    cards.forEach(card => {
        observer.observe(card);
    });

    const section = document.querySelector('.encim-style');
    if (section) {
        section.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = section.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            cards.forEach(card => {
                const depth = parseFloat(card.getAttribute('data-rotate')) / 10 || 1;
                const moveX = x * depth * 10;
                const moveY = y * depth * 10;
                card.style.transform = `rotate(${card.getAttribute('data-rotate')}deg) translate(${moveX}px, ${moveY}px)`;
            });
        });

        section.addEventListener('mouseleave', () => {
            cards.forEach(card => {
                card.style.transform = `rotate(${card.getAttribute('data-rotate')}deg)`;
            });
        });
    }
    document.getElementById("login-icon").addEventListener("click", function () {
        window.location.href = "login.html";
    });
});
document.addEventListener('DOMContentLoaded', function () {
    // Fungsi untuk mengatur slider
    function setupSlider(sliderSelector, dotSelector) {
        const sliderImages = document.querySelectorAll(`${sliderSelector} .slider-image`);
        const dots = document.querySelectorAll(`${dotSelector} .dot`);
        let currentIndex = 0;

        function showImage(index) {
            sliderImages.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            sliderImages[index].classList.add('active');
            dots[index].classList.add('active');
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % sliderImages.length;
            showImage(currentIndex);
        }

        // Jalankan slider otomatis setiap 3 detik
        setInterval(nextImage, 3000);

        // Tambahkan event listener untuk klik dot
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                showImage(currentIndex);
            });
        });
    }

    // Inisialisasi slider untuk Kebaya Encim
    setupSlider('.comparison-card:nth-child(1) .comparison-slider', '.comparison-card:nth-child(1) .slider-dots');

    // Inisialisasi slider untuk Kebaya Kutu Baru
    setupSlider('.comparison-card:nth-child(2) .comparison-slider', '.comparison-card:nth-child(2) .slider-dots');
});