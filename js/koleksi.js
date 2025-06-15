document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const categoryButtons = document.querySelectorAll('.category-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };

    // Daftar Produk dengan Rating dan Ulasan
    const products = [
        { id: 1, category: "Kebaya Encim", name: "Kebaya Encim Bordir Biru", price: 749000, image: "https://dynamic.zacdn.com/MbHhIGJgvN2qQF74MCglismMM_Q=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/soraya-kebaya-4554-1212203-1.jpg", description: "Kebaya modern dengan motif bordir bunga biru yang anggun, dipadukan dengan rok lilit navy. Cocok untuk acara formal maupun semi-formal.", rating: 4.5, reviews: ["Sangat elegan!", "Kualitas bagus, pas di badan."] },
        { id: 2, category: "Kebaya Encim", name: "Kebaya Hitam Bordir Colorful", price: 989000, image: "https://dynamic.zacdn.com/nhIN9iJUo2RYWkKiBtQfsryHyRo=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/soraya-kebaya-5750-7382372-1.jpg", description: "Kebaya hitam dengan motif bunga bordir warna-warni kontras dan bawahan hijau olive, tampil etnik modern.", rating: 4.2, reviews: ["Desain unik!", "Warna sangat cantik."] },
        { id: 3, category: "Kebaya Kutu Baru", name: "Kebaya Brokat Putih Lengan Pendek", price: 695000, image: "https://i.pinimg.com/736x/29/83/03/2983036f793885b33421cb13ad672cd2.jpg", description: "Kebaya brokat transparan lengan pendek dengan motif bunga besar kontras, cocok untuk gaya kasual etnik yang chic.", rating: 4.0, reviews: ["Nyaman dipakai.", "Harga worth it."] },
        { id: 4, category: "Kebaya Kutu Baru", name: "Kebaya Kartini Hitam Klasik", price: 719000, image: "https://dynamic.zacdn.com/K8zOTqInQ17SPmfq8RoKsJlNf-4=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/jamali-kebaya-2588-6428913-1.jpg", description: "Kebaya kutu baru model Kartini berwarna hitam polos dengan bawahan batik klasik, sederhana dan berwibawa.", rating: 4.3, reviews: ["Desain klasik!", "Cocok untuk acara adat."] },
        { id: 5, category: "Kebaya Encim", name: "Kebaya Pink Bordir Mawar", price: 875000, image: "https://dynamic.zacdn.com/dfDKfU4zE6y0qph0s92V15Adzzo=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/maslea-5885-2210264-1.jpg", description: "Kebaya encim berwarna pink lembut dengan detail bordir bunga mawar di bagian lengan dan kerah, memberikan kesan feminin dan elegan.", rating: 4.6, reviews: ["Sangat feminin!", "Bahan lembut."] },
        { id: 6, category: "Kebaya Kutu Baru", name: "Kebaya Biru Brokat Elegan", price: 589000, image: "https://dynamic.zacdn.com/MCKvDXkizUnGhKQZqDJSn6d2en0=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/anneira-9742-9617674-2.jpg", description: "Kebaya biru muda berbahan brokat dengan inner senada, dipadukan dengan kain lilit motif klasik. Cocok untuk acara resmi dan lamaran.", rating: 4.4, reviews: ["Elegan dan nyaman.", "Warna menarik."] },
        { id: 7, category: "Kebaya Encim", name: "Kebaya Kutu Baru Pink Cerah", price: 759000, image: "https://dynamic.zacdn.com/fioR5Nt6wLctEqHuMR31nQ7kVf4=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/jamali-kebaya-7276-7128234-1.jpg", description: "Kebaya kutu baru pink cerah dengan bordir bunga kuning-putih yang mencolok, cocok untuk gaya feminin yang menawan.", rating: 4.7, reviews: ["Warna cerah!", "Desain cantik."] },
        { id: 8, category: "Kebaya Encim", name: "Kebaya Kutu Baru Biru Kuning", price: 985000, image: "https://dynamic.zacdn.com/VA7mscCqDqoLPco3YfZW5Y1xoaU=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/jamali-kebaya-7253-8128234-1.jpg", description: "Perpaduan kebaya biru dongker dengan kain kuning terang bermotif tradisional, tampil elegan dan berani dalam satu balutan.", rating: 4.5, reviews: ["Unik dan berani!", "Kualitas bagus."] },
        { id: 9, category: "Kebaya Encim", name: "Kebaya Putih Bordir Biru", price: 725000, image: "https://dynamic.zacdn.com/b0ogLO8S_Gmv-C_gTK_Vtdw9NNM=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/bhatara-batik-1027-7938994-1.jpg", description: "Kebaya putih lengan pendek dengan bordir biru yang manis, cocok untuk tampilan simpel nan elegan.", rating: 4.1, reviews: ["Simpel tapi elegan.", "Nyaman dipakai."] },
        { id: 10, category: "Kebaya Encim", name: "Kebaya Fuschia Cerah", price: 829000, image: "https://i.pinimg.com/736x/3f/ae/9a/3fae9a10d9a9b0ea1dd92d79ad3ac12a.jpg", description: "Kebaya fuchsia lengan panjang dengan bordir bunga warna-warni yang ceria, tampil menonjol dan segar.", rating: 4.6, reviews: ["Warna mencolok!", "Bagus untuk acara."] },
        { id: 11, category: "Kebaya Encim", name: "Kebaya Hijau Segar", price: 839000, image: "https://i.pinimg.com/736x/2e/f9/aa/2ef9aacdca7dbb48eddf1c30a165a247.jpg", description: "Tampil percaya diri dengan kebaya hijau lime dan bordir bunga pink, cocok untuk acara formal maupun santai.", rating: 4.4, reviews: ["Segar dan stylish.", "Bahan adem."] },
        { id: 12, category: "Kebaya Encim", name: "Kebaya Putih Bordir Cerah", price: 750000, image: "https://i.pinimg.com/736x/f5/24/0b/f5240bea9bd8ad7627f27fba6c935467.jpg", description: "Kebaya putih klasik dengan bordir bunga warna cerah di kerah dan ujung lengan, bernuansa feminin dan kalem.", rating: 4.2, reviews: ["Kalem dan elegan.", "Fit di badan."] },
        { id: 13, category: "Kebaya Encim", name: "Kebaya Encim Bordir Putih", price: 890000, image: "https://i.pinimg.com/736x/3a/12/29/3a12297f7098bc807ad2b29c618bf0a3.jpg", description: "Kebaya putih dengan bordir bunga warna-warni, memberikan kesan klasik dan anggun.", rating: 4.5, reviews: ["Klasik dan cantik.", "Kualitas premium."] },
        { id: 14, category: "Kebaya Encim", name: "Kebaya Encim Hijau Tosca", price: 915000, image: "https://i.pinimg.com/736x/63/8b/37/638b37156e68e44b19dcdfc1a074d059.jpg", description: "Kebaya hijau tosca dengan bordir floral warna cerah, cocok untuk acara formal dan adat.", rating: 4.6, reviews: ["Warna unik!", "Cocok untuk adat."] },
        { id: 15, category: "Kebaya Encim", name: "Kebaya Brokat Merah Maroon", price: 980000, image: "https://dynamic.zacdn.com/RxUjNkfMTwonJEsdCmDit_LLfFs=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/soraya-kebaya-7888-5763994-1.jpg", description: "Kebaya maroon dengan detail bordir halus dan kain brokat, menonjolkan keanggunan.", rating: 4.7, reviews: ["Sangat anggun!", "Bahan mewah."] },
        { id: 16, category: "Kebaya Encim", name: "Kebaya Brokat Peach Lavender", price: 925000, image: "https://dynamic.zacdn.com/29y_FjF99b3ilHeZ6UZJUepb-9U=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/soraya-kebaya-7250-7153994-2.jpg", description: "Kebaya modern warna pink pastel dengan motif bunga besar yang feminin dan elegan.", rating: 4.5, reviews: ["Feminin dan lembut.", "Desain modern."] },
        { id: 17, category: "Kebaya Encim", name: "Kebaya Kuning Bordir Pink", price: 965000, image: "https://dynamic.zacdn.com/LpQprauQwozgc0Cz_XkuzTmaz88=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/soraya-kebaya-9978-1918994-2.jpg", description: "Kebaya pink manis dengan aksen brokat lembut, tampil lembut dan feminin.", rating: 4.4, reviews: ["Manis dan cantik.", "Nyaman dipakai."] },
        { id: 18, category: "Kebaya Encim", name: "Kebaya Encim Hitam Bordir", price: 955000, image: "https://dynamic.zacdn.com/a6SpwYb3-Q9uZPMLu6ofpGPU80A=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/soraya-kebaya-8168-6516774-2.jpg", description: "Kebaya hitam panjang dengan bordir floral cerah dan nuansa klasik.", rating: 4.3, reviews: ["Klasik dan elegan.", "Warna hitam pas."] },
        { id: 19, category: "Kebaya Kutu Baru", name: "Kebaya Kutu Baru Maroon Transparan", price: 880000, image: "https://dynamic.zacdn.com/Fhh4wJ-RzeHsh8gBRGxgdhCMJGw=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/anneira-4872-1617674-1.jpg", description: "Kebaya brokat maroon dengan potongan ramping dan nuansa mewah.", rating: 4.6, reviews: ["Mewah dan stylish.", "Fit sempurna."] },
        { id: 20, category: "Kebaya Kutu Baru", name: "Kebaya Brokat Maroon", price: 935000, image: "https://dynamic.zacdn.com/bWYTIoGFj_HrsWc49r_NuyrYQ4g=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/bhatara-batik-4435-8826994-1.jpg", description: "Kebaya brokat merah motif bunga klasik dengan potongan ramping dan elegan.", rating: 4.5, reviews: ["Klasik dan elegan.", "Bahan bagus."] },
        { id: 21, category: "Kebaya Kutu Baru", name: "Kebaya Brokat Peach", price: 935000, image: "https://dynamic.zacdn.com/0L4cpJwM6IfmXVgi9zg7iwJ9LB4=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/embara-7270-5077784-1.jpg", description: "Kebaya peach klasik dengan potongan modern dan elegan.", rating: 4.4, reviews: ["Lembut dan cantik.", "Cocok untuk acara."] },
        { id: 22, category: "Kebaya Kutu Baru", name: "Kebaya Brokat Pink Muda", price: 950000, image: "https://dynamic.zacdn.com/xfcUDZlPrakgp0_vSKx6OdNzKBQ=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/embara-7212-0767784-1.jpg", description: "Kebaya pink muda dengan desain bunga menyeluruh dan lengan puff.", rating: 4.6, reviews: ["Cantik dan modern.", "Nyaman dipakai."] },
        { id: 23, category: "Kebaya Kutu Baru", name: "Kebaya Brokat Abu Silver", price: 915000, image: "https://dynamic.zacdn.com/1XiFSnCXlfAsHwFeSi4T021qwcI=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/embara-7261-9967784-1.jpg", description: "Kebaya krem dengan renda manis dan potongan feminin, cocok untuk suasana santai.", rating: 4.3, reviews: ["Santai tapi elegan.", "Bahan ringan."] },
        { id: 24, category: "Kebaya Kutu Baru", name: "Kebaya Putih Bordir Hitam", price: 790000, image: "https://dynamic.zacdn.com/zi8Pv88DsRcAe-OjqjvScguXyss=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/batik-first-3228-2205254-1.jpg", description: "Kebaya organza putih dengan bordir motif batik warna hitam.", rating: 4.2, reviews: ["Unik dan stylish.", "Kualitas oke."] },
        { id: 25, category: "Kebaya Kutu Baru", name: "Kebaya Peach", price: 705000, image: "https://i.pinimg.com/736x/39/a3/e9/39a3e9858857e60a654ab0b9d8a40003.jpg", description: "Kebaya simple warna peach untuk gaya santai namun tetap formal.", rating: 4.1, reviews: ["Simpel dan nyaman.", "Warna lembut."] },
        { id: 26, category: "Kebaya Kutu Baru", name: "Kebaya Pink Lengan Lonceng", price: 730000, image: "https://dynamic.zacdn.com/zqtMu5JLgqmS6f9qGAYvh2cz1Lk=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/batik-first-9057-7298094-1.jpg", description: "Kebaya pink pastel dengan lengan lebar, cocok untuk acara santai.", rating: 4.3, reviews: ["Cantik dan unik.", "Nyaman dipakai."] },
        { id: 27, category: "Kebaya Kutu Baru", name: "Kebaya Pendek Putih", price: 515000, image: "https://dynamic.zacdn.com/Tp93mqH1-BVk0hKbQ7rFsiRmd2A=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/bhatara-batik-0053-0340654-1.jpg", description: "Kebaya putih pendek minimalis dengan motif tradisional.", rating: 4.0, reviews: ["Minimalis dan bagus.", "Harga terjangkau."] },
        { id: 28, category: "Kebaya Kutu Baru", name: "Kebaya Lemon Soft", price: 600000, image: "https://i.pinimg.com/736x/f4/e9/e0/f4e9e0fadfad8b39f9c48b1636cef423.jpg", description: "Kebaya kuning lemon, tampil santai dan modern.", rating: 4.2, reviews: ["Warna cerah!", "Nyaman untuk sehari-hari."] },
        { id: 29, category: "Kebaya Kutu Baru", name: "Kebaya Kuning Bright", price: 530000, image: "https://dynamic.zacdn.com/wxYQdTQCpVckj2GkM9AciOXjjys=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/batik-first-6152-8232062-1.jpg", description: "Kebaya kuning cerah dari bahan nyaman dan ringan.", rating: 4.1, reviews: ["Cerah dan segar.", "Bahan ringan."] },
        { id: 30, category: "Kebaya Kutu Baru", name: "Kebaya Organza Motif Bunga Soft Beige", price: 920000, image: "https://i.pinimg.com/736x/d2/6c/12/d26c12d483da10d5f4b0a2d7ce327f02.jpg", description: "Kebaya organza semi-transparan dengan warna beige dan motif floral lembut. Model lengan balon ¾ menambah kesan anggun.", rating: 4.7, reviews: ["Sangat cantik!", "Bahan premium."] }
    ];

    // Fungsi untuk menampilkan bintang rating
    function renderStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
        if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
        return stars;
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
                    <div class="quick-view-rating">${renderStars(product.rating)}</div>
                    <p class="quick-view-description">${product.description}</p>
                    <p class="quick-view-category">Kategori: ${product.category}</p>
                    <div class="quick-view-reviews">
                        <h4>Ulasan (${product.reviews.length})</h4>
                        ${product.reviews.map(review => `<p class="review-text">${review}</p>`).join('')}
                    </div>
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
        attachCartEventListeners();
    }

    initializePage();

    window.addEventListener('pageshow', function (event) {
        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            console.log('Page restored from cache or back navigation');
            updateCartUI();
        }
    });
});

document.getElementById("login-icon").addEventListener("click", function () {
    window.location.href = "login.html";
});