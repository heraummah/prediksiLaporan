<?php
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
    
    // Ambil data dari request POST
    $id = $_POST['id'] ?? '';
    $status = $_POST['status'] ?? '';
    
    // Validasi data
    if (!$id || !$status) {
        throw new Exception("Data tidak lengkap: ID dan status diperlukan");
    }
    
    // Validasi status hanya boleh Diverifikasi atau Ditolak
    if ($status !== "Diverifikasi" && $status !== "Ditolak") {
        throw new Exception("Status tidak valid: hanya menerima 'Diverifikasi' atau 'Ditolak'");
    }
    
    // Perbarui status di database
    $sql = "UPDATE laporanweb_masuk SET Status=? WHERE Id_Laporan=?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Prepare statement error: " . $conn->error);
    }
    
    $stmt->bind_param("ss", $status, $id);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute statement error: " . $stmt->error);
    }
    
    // Periksa apakah ada baris yang berubah
    if ($stmt->affected_rows < 1) {
        throw new Exception("Tidak ada data yang diperbarui. ID Laporan mungkin tidak ditemukan.");
    }
    
    // Kembalikan respons sukses
    echo json_encode(['status' => 'success', 'message' => "Status berhasil diubah menjadi $status"]);
    
} catch (Exception $e) {
    // Kembalikan respons error
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    // Tutup statement dan koneksi jika ada
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}