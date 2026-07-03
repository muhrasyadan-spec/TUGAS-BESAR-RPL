// Data penampung transaksi (Disimpan di memori browser)
let daftarTransaksi = [];

// ==========================================
// 1. LOGIKA HALAMAN LOGIN
// ==========================================
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const pesan = document.getElementById("pesan");

    // Login menggunakan data dari screenshot Anda
    if (user === "Muhrasyadan" && pass === "123") {
        // Berpindah ke file dashboard.html
        window.location.href = "dashboard.html";
    } else {
        // Teks peringatan jika salah input
        pesan.innerText = "Username atau password salah!";
    }
}

// ==========================================
// 2. LOGIKA INTERAKSI DASHBOARD KASIR
// ==========================================
function updateHargaOtomatis() {
    hitungTotalBayar();
}

function hitungTotalBayar() {
    const selectMinuman = document.getElementById("pilih-minuman");
    const jumlah = parseInt(document.getElementById("jumlah-beli").value) || 0;
    const displayTotal = document.getElementById("total-bayar-display");

    if (selectMinuman.value === "") {
        displayTotal.value = "Rp 0";
        return;
    }

    const hargaJual = parseInt(selectMinuman.options[selectMinuman.selectedIndex].getAttribute("data-harga"));
    const total = hargaJual * jumlah;
    
    displayTotal.value = "Rp " + total.toLocaleString("id-ID");
}

// ==========================================
// 3. LOGIKA INPUT & HITUNG KEUANGAN
// ==========================================
function tambahTransaksi(event) {
    event.preventDefault();

    const selectMinuman = document.getElementById("pilih-minuman");
    const qty = parseInt(document.getElementById("jumlah-beli").value);

    if (selectMinuman.value === "") return;

    const namaMenu = selectMinuman.value;
    const hargaJual = parseInt(selectMinuman.options[selectMinuman.selectedIndex].getAttribute("data-harga"));
    const hargaModal = parseInt(selectMinuman.options[selectMinuman.selectedIndex].getAttribute("data-modal"));

    const totalJual = hargaJual * qty;
    const totalModal = hargaModal * qty;
    const untungBersih = totalJual - totalModal;

    const dataBaru = {
        id: Date.now(),
        menu: namaMenu,
        qty: qty,
        totalJual: totalJual,
        totalModal: totalModal,
        untung: untungBersih
    };

    daftarTransaksi.push(dataBaru);
    
    // Reset Form
    document.getElementById("form-transaksi").reset();
    document.getElementById("total-bayar-display").value = "Rp 0";
    
    perbaruiDashboard();
}

function perbaruiDashboard() {
    let omzet = 0;
    let modal = 0;
    let profit = 0;
    
    const tbody = document.getElementById("tabel-riwayat");
    tbody.innerHTML = ""; 

    daftarTransaksi.forEach((item) => {
        omzet += item.totalJual;
        modal += item.totalModal;
        profit += item.untung;

        const row = `
            <tr>
                <td><strong>${item.menu}</strong></td>
                <td>${item.qty}</td>
                <td>Rp ${item.totalJual.toLocaleString("id-ID")}</td>
                <td style="color: #2e7d32; font-weight:600;">+Rp ${item.untung.toLocaleString("id-ID")}</td>
                <td><button onclick="hapusTransaksi(${item.id})" class="btn-delete">Hapus</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    // Menampilkan total kalkulasi ke kartu dashboard atas
    document.getElementById("total-pendapatan").innerText = "Rp " + omzet.toLocaleString("id-ID");
    document.getElementById("total-modal").innerText = "Rp " + modal.toLocaleString("id-ID");
    document.getElementById("total-keuntungan").innerText = "Rp " + profit.toLocaleString("id-ID");
}

function hapusTransaksi(id) {
    daftarTransaksi = daftarTransaksi.filter(item => item.id !== id);
    perbaruiDashboard();
}

function logout() {
    // Kembali ke halaman login
    window.location.href = "Login.HTML";
}