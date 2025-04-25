<?php
// File ini untuk mengambil data dari database MySQL dan dikirim dalam format JSON

// Matikan error reporting untuk mencegah pesan HTML error
error_reporting(0);
ini_set('display_errors', 0);

// Set header untuk JSON
header('Content-Type: application/json');

try {
    // Koneksi ke database
    include_once 'config.php';
    
    // Cek koneksi
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Koneksi gagal: " . ($conn->connect_error ?? "File config.php tidak ditemukan atau variabel \$conn tidak didefinisikan"));
    }
    
    // Query ambil data dari tabel laporan
    $query = "SELECT Id_Laporan, Tanggal_Laporan, Nama, Jenis_Laporan, Kota_Administrasi, 
              Alamat_Kejadian, Tanggal_Kejadian, Laporan, Bukti, Status
              FROM laporanweb_masuk 
              ORDER BY Tanggal_Laporan DESC";
    
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception("Query error: " . $conn->error);
    }
    
    $data = [];
    
    while ($row = $result->fetch_assoc()) {
        // Memastikan Status_Verifikasi memiliki nilai default
        if (!isset($row['Status_Verifikasi'])) {
            $row['Status_Verifikasi'] = "Menunggu";
        }
        $data[] = $row;
    }
    
    // Mengembalikan data sebagai JSON
    echo json_encode($data);
    
} catch (Exception $e) {
    // Mengembalikan error sebagai JSON
    echo json_encode([
        "error" => true,
        "message" => $e->getMessage()
    ]);
} finally {
    // Tutup koneksi jika ada
    if (isset($conn)) {
        $conn->close();
    }
}