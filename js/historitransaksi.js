
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const transactionsContainer = document.getElementById('transactions-container');
    const applyFilterBtn = document.getElementById('apply-filter');
    const dateFromInput = document.getElementById('date-from');
    const dateToInput = document.getElementById('date-to');
    const statusFilter = document.getElementById('status-filter');

    // Muat transaksi dari localStorage
    let transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
    let filteredTransactions = [...transactionHistory];

    // Format harga
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Format tanggal dan waktu berdasarkan data transaksi
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

    // Fungsi untuk mendapatkan waktu saat ini dalam zona WIB
    function getCurrentWIBTime() {
        const now = new Date();
        const wibString = now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
        return new Date(wibString).toISOString();
    }

    // Tambahkan transaksi baru dengan waktu real-time
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
            paymentMethod: transactionData.paymentMethod
        };

        transactionHistory.unshift(newTransaction);
        localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
        filteredTransactions = [...transactionHistory];
        renderTransactions();
        showNotification(`Transaksi ${newTransaction.id} berhasil dicatat pada ${formatDate(currentTime)}`);

        return newTransaction;
    }

    // Update status transaksi dengan waktu update
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
                `<i class="fas fa-tshirt"></i>`
            }
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
                            <i class="fas fa-receipt"></i>
                            ${transaction.id}
                        </div>
                        <div class="transaction-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(transaction.date)} <!-- Tampilkan waktu transaksi asli -->
                        </div>
                    </div>
                    ${getStatusBadge(transaction.status)}
                </div>
                
                <div class="transaction-details">
                    <div class="transaction-items">
                        ${itemsHTML}
                    </div>
                    
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
                    <i class="fas fa-shopping-cart"></i>
                    Mulai Belanja
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

        // animasi
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
                    const fromDate = new Date(dateFrom + 'T00:00:00+07:00'); // WIB awal hari
                    matchesDate = matchesDate && transactionDate >= fromDate;
                }

                if (dateTo) {
                    const toDate = new Date(dateTo + 'T23:59:59+07:00'); // WIB akhir hari
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

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Tutup menu mobile saat klik di luar
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // Fungsi untuk dapatkan tanggal YYYY-MM-DD sesuai zona waktu WIB
    function getWIBDateString(date) {
        return date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
    }

    // Inisialisasi halaman
    function initializePage() {
        const now = new Date();
        const todayWIB = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
        const thirtyDaysAgoWIB = new Date(todayWIB);
        thirtyDaysAgoWIB.setDate(todayWIB.getDate() - 30);

        dateToInput.value = getWIBDateString(todayWIB);
        // dateFromInput.value = getWIBDateString(thirtyDaysAgoWIB);

        renderTransactions();
        window.addTransaction = addTransaction;
    }

    // Smooth scroll untuk tautan internal
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

    // Inisialisasi semua
    initializePage();
});