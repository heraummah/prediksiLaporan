<?php
// Script untuk membantu menampilkan file bukti
error_reporting(0);
ini_set('display_errors', 0);

// Ambil nama file dari query string
$filename = $_GET['file'] ?? '';

if (empty($filename)) {
    die("Error: Nama file tidak diberikan");
}

// Validasi nama file untuk keamanan (hanya karakter yang diperbolehkan)
if (!preg_match('/^[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|txt)$/i', $filename)) {
    die("Error: Format nama file tidak valid");
}

// Daftar kemungkinan path untuk file bukti
$possiblePaths = [
    './uploads/' . $filename,
    '../uploads/' . $filename,
    '../Lapor/uploads/' . $filename,
    dirname(__FILE__) . '/uploads/' . $filename,
    dirname(__FILE__) . '/../uploads/' . $filename,
    dirname(__FILE__) . '/../Lapor/uploads/' . $filename
];

$filePath = null;

// Cari file yang ada
foreach ($possiblePaths as $path) {
    if (file_exists($path) && is_file($path)) {
        $filePath = $path;
        break;
    }
}

// Jika file tidak ditemukan
if ($filePath === null) {
    die("Error: File tidak ditemukan di server");
}

// Dapatkan ekstensi file
$fileExt = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

// Set header content type berdasarkan ekstensi file
switch ($fileExt) {
    case 'jpg':
    case 'jpeg':
        header('Content-Type: image/jpeg');
        break;
    case 'png':
        header('Content-Type: image/png');
        break;
    case 'gif':
        header('Content-Type: image/gif');
        break;
    case 'pdf':
        header('Content-Type: application/pdf');
        break;
    case 'doc':
    case 'docx':
        header('Content-Type: application/msword');
        break;
    case 'xls':
    case 'xlsx':
        header('Content-Type: application/vnd.ms-excel');
        break;
    case 'txt':
        header('Content-Type: text/plain');
        break;
    default:
        header('Content-Type: application/octet-stream');
}

// Set header untuk download jika bukan file gambar
if (!in_array($fileExt, ['jpg', 'jpeg', 'png', 'gif'])) {
    header('Content-Disposition: attachment; filename="' . $filename . '"');
}

// Output file
readfile($filePath);
exit;
?>