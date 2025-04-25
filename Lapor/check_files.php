<?php
// Script sederhana untuk memeriksa file bukti
header('Content-Type: text/html; charset=utf-8');

echo "<h1>Pemeriksaan File Bukti</h1>";

// Koneksi ke database
require_once 'config.php';

if (!isset($conn) || $conn->connect_error) {
    die("<p style='color:red'>Koneksi database gagal: " . ($conn->connect_error ?? "File config.php tidak ditemukan") . "</p>");
}

// Ambil daftar file bukti dari database
$result = $conn->query("SELECT Id_Laporan, Bukti FROM laporanweb_masuk WHERE Bukti IS NOT NULL AND Bukti != ''");

if (!$result) {
    die("<p style='color:red'>Query error: " . $conn->error . "</p>");
}

// Path potensial untuk folder uploads
$paths = [
    '../Lapor/uploads/',
    './uploads/',
    '../uploads/',
    '../../uploads/',
    dirname(__FILE__) . '/../Lapor/uploads/',
    dirname(__FILE__) . '/uploads/',
];

echo "<h2>Informasi Server</h2>";
echo "<p>Current script path: " . __FILE__ . "</p>";
echo "<p>Current directory: " . dirname(__FILE__) . "</p>";
echo "<p>Document root: " . $_SERVER['DOCUMENT_ROOT'] . "</p>";

echo "<h2>Cek Daftar File</h2>";
echo "<p>Daftar file bukti dari database:</p>";
echo "<table border='1' cellpadding='5'>";
echo "<tr><th>ID Laporan</th><th>Nama File</th><th>Lokasi Ditemukan</th><th>Akses Langsung</th></tr>";

while ($row = $result->fetch_assoc()) {
    $id = $row['Id_Laporan'];
    $filename = $row['Bukti'];
    $found = false;
    $foundPath = "";
    
    // Periksa file di berbagai lokasi
    foreach ($paths as $path) {
        $fullPath = $path . $filename;
        if (file_exists($fullPath)) {
            $found = true;
            $foundPath = $path;
            break;
        }
    }
    
    // Tampilkan informasi file
    echo "<tr>";
    echo "<td>" . $id . "</td>";
    echo "<td>" . $filename . "</td>";
    
    if ($found) {
        echo "<td style='color:green'>" . $foundPath . " (DITEMUKAN)</td>";
        echo "<td><a href='" . $foundPath . $filename . "' target='_blank'>Lihat File</a></td>";
    } else {
        echo "<td style='color:red'>File tidak ditemukan di semua lokasi</td>";
        echo "<td>-</td>";
    }
    
    echo "</tr>";
}

echo "</table>";

// Buat list semua file di folder uploads
echo "<h2>Isi Folder uploads</h2>";

foreach ($paths as $path) {
    echo "<h3>Path: " . $path . "</h3>";
    
    if (is_dir($path)) {
        $files = scandir($path);
        if (count($files) > 2) { // Lebih dari . dan ..
            echo "<ul>";
            foreach ($files as $file) {
                if ($file != "." && $file != "..") {
                    echo "<li>" . $file . " - <a href='" . $path . $file . "' target='_blank'>Lihat</a></li>";
                }
            }
            echo "</ul>";
        } else {
            echo "<p>Folder kosong atau hanya berisi . dan ..</p>";
        }
    } else {
        echo "<p style='color:orange'>Folder tidak ditemukan</p>";
    }
}

// Solusi
echo "<h2>Solusi</h2>";
echo "<p>Berdasarkan pemeriksaan di atas, untuk melihat file bukti:</p>";
echo "<ol>";
echo "<li>Pastikan file bukti ada di salah satu folder uploads (sebaiknya di ../Lapor/uploads/)</li>";
echo "<li>Ubah fungsi handleViewEvidence di scriptDashboardAdmin.js untuk menggunakan path yang benar</li>";
echo "</ol>";

echo "<h3>Kode JavaScript yang Diperbarui:</h3>";
echo "<pre style='background:#f5f5f5; padding:10px; border:1px solid #ddd; overflow:auto;'>";
echo "function handleViewEvidence(buktiFile) {
  if (!buktiFile) {
    Swal.fire({
      title: \"Tidak Ada Bukti\",
      text: \"Tidak ada file bukti yang diunggah untuk laporan ini.\",
      icon: \"info\"
    });
    return;
  }

  // Cek apakah ekstensi file adalah gambar
  const isImage = /\\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(buktiFile);
  
  // Path yang benar (sesuaikan dengan hasil pemeriksaan di atas)
  const buktiPath = \"../Lapor/uploads/\" + buktiFile;
  
  if (isImage) {
    // Menampilkan gambar dalam modal
    Swal.fire({
      title: 'Bukti Laporan',
      html: `
        <div class=\"image-container\">
          <img src=\"\${buktiPath}\" 
               alt=\"Bukti Laporan\" 
               style=\"max-width: 100%; max-height: 400px;\">
        </div>
        <p class=\"mt-3\">Nama File: \${buktiFile}</p>
      `,
      width: 600,
      confirmButtonText: 'Tutup',
      showCloseButton: true
    });
  } else {
    // Jika bukan gambar, tampilkan info tentang file
    Swal.fire({
      title: 'Bukti Laporan',
      html: `
        <div class=\"file-info\">
          <p><strong>Nama File:</strong> \${buktiFile}</p>
          <p>File ini bukan gambar dan tidak dapat ditampilkan langsung.</p>
          <p>Silakan akses file secara manual di lokasi:</p>
          <code>\${buktiPath}</code>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Tutup'
    });
  }
}";
echo "</pre>";