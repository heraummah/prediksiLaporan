<?php
require_once 'config.php'; // menyesuaikan path kalau perlu

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama     = sanitizeInput($_POST['nama'] ?? '');
    $jenis    = sanitizeInput($_POST['jenis'] ?? '');
    $kota     = sanitizeInput($_POST['kota'] ?? '');
    $alamat   = sanitizeInput($_POST['alamat'] ?? '');
    $tanggal  = sanitizeInput($_POST['tanggal'] ?? '');
    $laporan  = sanitizeInput($_POST['laporan'] ?? '');
    $bukti    = $_FILES['bukti'] ?? null;

    // Generate ID otomatis
    $id = generateReportID($jenis);
    $waktu_laporan = getCurrentDateTime();

    // Simpan file bukti
    $uploadDir = '../Lapor/uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $filename = $id . '_' . basename($bukti['name']);
    $uploadPath = $uploadDir . $filename;

    if (move_uploaded_file($bukti['tmp_name'], $uploadPath)) {
        $buktiPathForDB = 'uploads/' . $filename;
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Gagal mengunggah file bukti.'
        ];
        echo json_encode($response);
        exit;
    }

    // Simpan ke database
    $stmt = $conn->prepare("INSERT INTO laporanweb_masuk (Id_Laporan, Tanggal_Laporan, Nama, Jenis_Laporan, Kota_Administrasi, Alamat_Kejadian, Tanggal_Kejadian, Laporan, Bukti) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssss", $id, $waktu_laporan, $nama, $jenis, $kota, $alamat, $tanggal, $laporan, $buktiPathForDB);

    if ($stmt->execute()) {
        $response = [
            'status' => 'success',
            'message' => 'Laporan berhasil dikirim!'
        ];
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Gagal menyimpan data ke database.'
        ];
    }

    $stmt->close();
    $conn->close();

    echo json_encode($response);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Metode tidak valid.']);
}
?>
