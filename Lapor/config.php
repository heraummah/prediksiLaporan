<?php
// config.php - File konfigurasi untuk koneksi database

// Parameter koneksi database
$host = "localhost"; // Ganti dengan host MySQL Anda
$username = "root";  // Ganti dengan username MySQL Anda
$password = "";      // Ganti dengan password MySQL Anda
$database = "sistem_prediksi"; // Nama database

// Membuat koneksi
$conn = new mysqli($host, $username, $password, $database);

// Memeriksa koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Set karakter encoding
$conn->set_charset("utf8");

// Fungsi untuk membuat ID laporan unik
function generateReportID($jenis) {
    // Format: JAKIXX-NNN  
    // XX: Kode jenis laporan (25 untuk sampah, 10 untuk banjir)
    // NNN: Nomor urut 3 digit
    
    global $conn;
    
    // Tentukan kode berdasarkan jenis laporan
    $kode = "";
    if (strtolower($jenis) == "sampah") {
        $kode = "25";
    } elseif (strtolower($jenis) == "banjir") {
        $kode = "10";
    } else {
        $kode = "00"; // default
    }
    
    // Cari nomor terakhir dengan kode ini
    $sql = "SELECT Id_Laporan FROM laporanweb_masuk WHERE Id_Laporan LIKE 'JAKI$kode-%' ORDER BY Id_Laporan DESC LIMIT 1";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $lastID = $row['Id_Laporan'];
        $lastNumber = intval(substr($lastID, -3));
        $newNumber = $lastNumber + 1;
    } else {
        $newNumber = 1;
    }
    
    // Format nomor dengan padding 3 digit
    $formattedNumber = sprintf("%03d", $newNumber);
    
    return "JAKI$kode-$formattedNumber";
}

// Fungsi untuk mendapatkan waktu saat ini
function getCurrentDateTime() {
    return date('Y-m-d H:i:s');
}

// Fungsi untuk memformat tanggal dari yyyy-mm-dd ke dd/mm/yyyy
function formatDate($date) {
    if (empty($date)) return "-";
    $timestamp = strtotime($date);
    return date("d/m/Y", $timestamp);
}

// Fungsi untuk memformat tanggal dan waktu dari yyyy-mm-dd hh:mm:ss ke dd/mm/yyyy hh:mm
function formatDateTime($datetime) {
    if (empty($datetime)) return "-";
    $timestamp = strtotime($datetime);
    return date("d/m/Y H:i", $timestamp);
}

// Fungsi untuk membersihkan input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>