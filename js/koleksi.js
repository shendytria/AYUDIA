document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    const loginIcon = document.getElementById('login-icon');
    const closeModal = document.getElementById('close-modal');
    const loginModal = document.getElementById('login-modal');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const categoryButtons = document.querySelectorAll('.category-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };

    // Kredensial Admin
    const adminCredentials = {
        email: "admin@gmail.com",
        password: "admin123"
    };

    // Daftar Produk
    const products = [
        { id: 1, category: "Kebaya Encim", name: "Kebaya Srikandi Putih", price: 879000, image: "https://i.pinimg.com/736x/dc/41/3a/dc413aaad4cfb2529f93705c16a53132.jpg", description: "Kebaya putih dengan potongan anggun dan bordir klasik, cocok untuk acara formal penuh pesona." },
        { id: 2, category: "Kebaya Encim", name: "Kebaya Srikandi Maroon", price: 925000, image: "https://i.pinimg.com/736x/55/dd/f2/55ddf2156980e7d0c2220496d4453f22.jpg", description: "Kebaya maroon yang memikat dengan detail elegan, memberi kesan tegas namun feminin." },
        { id: 3, category: "Kebaya Kutu Baru", name: "Kebaya Coklat Semu", price: 599000, image: "https://i.pinimg.com/736x/c9/8b/1f/c98b1f5028067956a8723ed444fbe024.jpg", description: "Kebaya warna coklat lembut dengan model sederhana, cocok untuk tampilan modern sehari-hari." },
        { id: 4, category: "Kebaya Kutu Baru", name: "Kebaya Biru", price: 759000, image: "https://i.pinimg.com/736x/17/d1/19/17d1193b4d574803a8878cef83c3317c.jpg", description: "Kebaya biru langit dengan motif floral halus, tampil segar dan elegan." },
        { id: 5, category: "Kebaya Encim", name: "Kebaya Rona Salem", price: 999000, image: "https://i.pinimg.com/736x/3e/dc/f9/3edcf925078f4c845096f84dfcb8c0e9.jpg", description: "Kebaya warna salem mewah dengan nuansa keemasan yang menawan." },
        { id: 6, category: "Kebaya Kutu Baru", name: "Kebaya Hijau Semu", price: 589000, image: "https://i.pinimg.com/736x/b7/d0/9b/b7d09b15e212a5f9b21cd01249706d32.jpg", description: "Kebaya hijau muda dengan sentuhan elegan, pas untuk gaya simpel dan berkelas." },
        { id: 7, category: "Kebaya Encim", name: "Kebaya Larasati Merah", price: 875000, image: "https://i.pinimg.com/736x/82/2d/61/822d619f556c0baeef92b29b4109876e.jpg", description: "Kebaya merah merona dengan sulaman klasik, tampil percaya diri di setiap acara." },
        { id: 8, category: "Kebaya Encim", name: "Kebaya Larasati Hijau", price: 935000, image: "https://i.pinimg.com/736x/5a/03/19/5a0319a5781f62e50f5086fc0b1d1cc8.jpg", description: "Kebaya hijau zamrud dengan motif etnik, cocok untuk gaya yang berani dan segar." },
        { id: 9, category: "Kebaya Encim", name: "Kebaya Rona Biru", price: 955000, image: "https://i.pinimg.com/736x/cc/68/c1/cc68c1f734707ed34e3a7617b02a27eb.jpg", description: "Warna biru muda yang kalem dengan potongan klasik nan anggun." },
        { id: 10, category: "Kebaya Encim", name: "Kebaya Rona Kuning", price: 965000, image: "https://i.pinimg.com/736x/fa/ec/e3/faece35ce7445b13db960479627661e5.jpg", description: "Kebaya kuning cerah dengan detail simpel namun memikat, cocok untuk acara siang hari." },
        { id: 11, category: "Kebaya Encim", name: "Kebaya Brokat Putih", price: 925000, image: "https://i.pinimg.com/736x/d0/05/4d/d0054d22c8d959ca9d901fd4634817da.jpg", description: "Kebaya putih elegan dengan brokat penuh pesona, pas untuk gaya minimalis mewah." },
        { id: 12, category: "Kebaya Encim", name: "Kebaya Rona Hijau", price: 975000, image: "https://i.pinimg.com/736x/d1/d6/1f/d1d61fcd20c9950d83a6240de5d9d677.jpg", description: "Hijau pastel yang manis dengan bordir lembut, sempurna untuk kesan alami." },
        { id: 13, category: "Kebaya Encim", name: "Kebaya Puspa Senna", price: 965000, image: "https://i.pinimg.com/736x/d7/be/8a/d7be8a540e546720f31537a60e6ddbaa.jpg", description: "Kebaya kuning senna yang cerah dan hangat, cocok untuk momen spesial ceria." },
        { id: 14, category: "Kebaya Encim", name: "Kebaya Puspa Rapsodi", price: 915000, image: "https://i.pinimg.com/736x/62/51/37/6251378c9558d622f9830574bed56248.jpg", description: "Kebaya abu-abu elegan dengan gaya modern yang tetap tradisional." },
        { id: 15, category: "Kebaya Encim", name: "Kebaya Tulle Black", price: 999000, image: "https://i.pinimg.com/736x/97/21/68/972168a7e87602a54544436d0c6a8846.jpg", description: "Kebaya hitam dengan tulle dan bordir emas, tampil dramatis dan mewah." },
        { id: 16, category: "Kebaya Encim", name: "Kebaya Blouse Abu", price: 575000, image: "https://dynamic.zacdn.com/MMR6xeH-QThjdFKXTAatVEjwO3o=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/jamali-kebaya-7348-5344964-1.jpg", description: "Blouse kebaya abu-abu dengan desain simpel kontemporer, cocok untuk keseharian." },
        { id: 17, category: "Kebaya Encim", name: "Kebaya Rona Pink", price: 965000, image: "https://i.pinimg.com/736x/3f/ae/9a/3fae9a10d9a9b0ea1dd92d79ad3ac12a.jpg", description: "Kebaya pink manis dengan aksen brokat lembut, tampil lembut dan feminin." },
        { id: 18, category: "Kebaya Encim", name: "Kebaya Brokat Hitam", price: 985000, image: "https://dynamic.zacdn.com/wlxRRMnXqriS5OD64MuvKD1nIrc=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/anneira-9763-9608374-2.jpg", description: "Hitam klasik dengan brokat modern, memberikan kesan elegan abadi." },
        { id: 19, category: "Kebaya Kutu Baru", name: "Kebaya Orange", price: 899000, image: "https://i.pinimg.com/736x/55/6a/85/556a85935d020ed9cb809f2a8cc8c58a.jpg", description: "Kebaya warna oranye dengan detail tradisional, tampil hangat dan energik." },
        { id: 20, category: "Kebaya Kutu Baru", name: "Kebaya Tulle Maroon", price: 945000, image: "https://i.pinimg.com/736x/6b/a6/3c/6ba63c37dc30417077a4864496c76463.jpg", description: "Kebaya maroon dengan tulle dan bordir lembut, cocok untuk acara malam." },
        { id: 21, category: "Kebaya Kutu Baru", name: "Kebaya Aleya Pink", price: 579000, image: "https://i.pinimg.com/736x/43/22/46/43224671ab73fc86fe707c7d4fdcba7f.jpg", description: "Kebaya pink terang dengan desain klasik yang feminin dan segar." },
        { id: 22, category: "Kebaya Kutu Baru", name: "Kebaya Sekar Putih", price: 595000, image: "https://i.pinimg.com/736x/29/83/03/2983036f793885b33421cb13ad672cd2.jpg", description: "Kebaya putih polos dengan potongan kontemporer, cocok untuk tampilan minimalis." },
        { id: 23, category: "Kebaya Kutu Baru", name: "Kebaya Cempaka Krem", price: 915000, image: "https://i.pinimg.com/736x/95/53/10/955310d1dd6914dc46d15aafee39d853.jpg", description: "Kebaya krem dengan renda manis dan potongan feminin, cocok untuk suasana santai." },
        { id: 24, category: "Kebaya Kutu Baru", name: "Kebaya Cempaka Pastel", price: 975000, image: "https://i.pinimg.com/736x/ea/8d/7f/ea8d7f0258232ab5c33896ec665c5a04.jpg", description: "Warna pastel cerah dengan brokat halus, tampil lembut dan memukau." },
        { id: 25, category: "Kebaya Kutu Baru", name: "Kebaya Santria Krem", price: 985000, image: "https://i.pinimg.com/736x/39/a3/e9/39a3e9858857e60a654ab0b9d8a40003.jpg", description: "Krem yang lembut dengan sentuhan tradisional, cocok untuk acara keluarga." },
        { id: 26, category: "Kebaya Kutu Baru", name: "Kebaya Linda Pink", price: 935000, image: "https://dynamic.zacdn.com/zqtMu5JLgqmS6f9qGAYvh2cz1Lk=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/batik-first-9057-7298094-1.jpg", description: "Kebaya pink lembut dengan gaya modern minimalis, tetap elegan." },
        { id: 27, category: "Kebaya Kutu Baru", name: "Kebaya Asri Biru Muda", price: 985000, image: "https://dynamic.zacdn.com/MCKvDXkizUnGhKQZqDJSn6d2en0=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/anneira-9742-9617674-2.jpg", description: "Kebaya biru muda dengan detail renda, tampil anggun dan mempesona." },
        { id: 28, category: "Kebaya Kutu Baru", name: "Kebaya Kutu Baru Tosca", price: 979000, image: "https://i.pinimg.com/736x/f4/e9/e0/f4e9e0fadfad8b39f9c48b1636cef423.jpg", description: "Kebaya warna tosca segar dengan potongan unik, tampil beda dan menawan." },
        { id: 29, category: "Kebaya Kutu Baru", name: "Kebaya Asri Maroon", price: 949000, image: "https://dynamic.zacdn.com/Fhh4wJ-RzeHsh8gBRGxgdhCMJGw=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/anneira-4872-1617674-1.jpg", description: "Maroon dalam dengan aksen renda halus, memberikan nuansa elegan dan klasik." },
        { id: 30, category: "Kebaya Kutu Baru", name: "Kebaya Sania Hitam", price: 999000, image: "https://dynamic.zacdn.com/K8zOTqInQ17SPmfq8RoKsJlNf-4=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/jamali-kebaya-2588-6428913-1.jpg", description: "Hitam klasik dengan desain bersih dan potongan tajam, cocok untuk gaya formal modern." }
    ];

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

    // Mengisi produk secara dinamis
    function populateProducts() {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) {
            console.error('Product grid not found');
            return;
        }
        productGrid.innerHTML = '';
        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card fade-in';
            productCard.dataset.id = product.id;
            productCard.dataset.category = product.category;
            productCard.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" />
                    <div class="product-actions">
                        <button class="quick-view"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">Rp ${formatPrice(product.price)}</p>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
        updateEventListeners();
        updateCategoryFilters();
    }

    // Memperbarui event listeners setelah produk dimuat
    function updateEventListeners() {
        const quickViewButtons = document.querySelectorAll('.quick-view');
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const productId = parseInt(productCard.dataset.id);
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        showQuickView(product);
                    }
                }
            });
        });
    }

    // Memperbarui filter kategori
    function updateCategoryFilters() {
        const productCards = document.querySelectorAll('.product-card');
        if (categoryButtons.length === 0) {
            console.warn('No category buttons found');
            return;
        }
        categoryButtons.forEach(button => {
            button.addEventListener('click', function () {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const category = this.getAttribute('data-category');
                productCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
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
            if (loginModal) loginModal.classList.remove('active');
            const quickViewModal = document.getElementById('quick-view-modal');
            if (quickViewModal) quickViewModal.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    } else {
        console.error('Cart elements not found:', { cartIcon, cartSidebar, closeCart, overlay });
    }

    // Event Listener untuk Login
    if (loginIcon && loginModal && closeModal && overlay) {
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
    } else {
        console.error('Login elements not found:', { loginIcon, loginModal, closeModal, overlay });
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
                    if (overlay) {
                        overlay.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
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

    // Event Listener untuk Quick View
    document.addEventListener('click', function (e) {
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

    // Tampilkan Modal Quick View
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

        const sizeButtons = quickViewModal.querySelectorAll('.size-btn');
        let selectedSize = null;
        sizeButtons.forEach(button => {
            button.addEventListener('click', function () {
                sizeButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                selectedSize = this.dataset.size;
            });
        });

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

    // Perbarui UI Keranjang
    function updateCartUI() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalElement = document.querySelector('.cart-total span:last-child');
        if (!cartItemsContainer || !cartTotalElement) {
            console.error('Cart UI elements not found:', { cartItemsContainer, cartTotalElement });
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

    // Pasang Event Listener untuk Keranjang
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
                const item = cart.items.find(item => item.id === productId && item.size === productSize);
                removeFromCart(productId, productSize);
                cartItem.remove();
                showNotification(`${item.name} (Size: ${item.size}) dihapus dari keranjang!`);
            }
        });
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

    // Hapus dari Keranjang
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

    // Format Harga
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

    // Inisialisasi Halaman
    function initializePage() {
        populateProducts();
        updateCartUI();
        attachCartEventListeners(); // Panggil sekali saat inisialisasi
    }

    // Panggil inisialisasi
    initializePage();

    // Tangani navigasi kembali atau muat ulang
    window.addEventListener('pageshow', function (event) {
        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            console.log('Page restored from cache or back navigation');
            updateCartUI();
        }
    });
});