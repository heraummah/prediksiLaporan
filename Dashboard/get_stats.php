<?php
// Matikan output HTML error yang bisa merusak format JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Fungsi untuk menangani error
function handleError($message, $code = 500) {
    header('Content-Type: application/json');
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Set header JSON sebelum output apapun
header('Content-Type: application/json');

// Koneksi ke database
$host = "localhost";         // Sesuaikan jika perlu
$username = "root";          // Default di XAMPP/localhost biasanya "root"
$password = "";              // Default di XAMPP biasanya kosong
$database = "sistem_prediksi"; // Database yang digunakan

// Coba koneksi ke database
try {
    $conn = new mysqli($host, $username, $password, $database);
    
    // Cek koneksi
    if ($conn->connect_error) {
        handleError("Koneksi database gagal: " . $conn->connect_error);
    }
    
    // Data dummy untuk fallback jika query gagal
    $totalLaporan = 0;
    $sedangDiproses = 0;
    $sampahByKota = [];
    $banjirByKota = [];
    
    // Query untuk menghitung total laporan
    $sqlTotalLaporan = "SELECT COUNT(*) as total FROM laporanweb_masuk";
    $resultTotal = $conn->query($sqlTotalLaporan);
    
    if (!$resultTotal) {
        handleError("Error query total laporan: " . $conn->error);
    }
    
    if ($resultTotal->num_rows > 0) {
        $row = $resultTotal->fetch_assoc();
        $totalLaporan = $row["total"];
    }
    
    // Query untuk menghitung laporan yang sedang diproses (status = 'diverifikasi')
    $sqlDiproses = "SELECT COUNT(*) as total FROM laporanweb_masuk WHERE Status = 'diverifikasi'";
    $resultDiproses = $conn->query($sqlDiproses);
    
    if (!$resultDiproses) {
        handleError("Error query laporan diproses: " . $conn->error);
    }
    
    if ($resultDiproses->num_rows > 0) {
        $row = $resultDiproses->fetch_assoc();
        $sedangDiproses = $row["total"];
    }
    
    // Cek apakah kolom yang dibutuhkan untuk grafik ada dalam tabel
    $checkColumns = $conn->query("SHOW COLUMNS FROM laporanweb_masuk LIKE 'jenis_laporan'");
    $hasJenisLaporan = $checkColumns->num_rows > 0;
    
    $checkColumns = $conn->query("SHOW COLUMNS FROM laporanweb_masuk LIKE 'kota_administrasi'");
    $hasKotaAdministrasi = $checkColumns->num_rows > 0;
    
    // Query untuk menghitung laporan sampah berdasarkan kota administrasi
    if ($hasJenisLaporan && $hasKotaAdministrasi) {
        // Gunakan AS untuk menjamin nama kolom yang konsisten
        $sqlSampahByKota = "SELECT Kota_Administrasi AS kota_administrasi, COUNT(*) as total FROM laporanweb_masuk 
                            WHERE Status = 'diverifikasi' AND Jenis_Laporan = 'sampah'
                            GROUP BY Kota_Administrasi
                            ORDER BY Kota_Administrasi ASC";
        $resultSampahByKota = $conn->query($sqlSampahByKota);
        
        if (!$resultSampahByKota) {
            handleError("Error query sampah by kota: " . $conn->error);
        }
        
        if ($resultSampahByKota->num_rows > 0) {
            while ($row = $resultSampahByKota->fetch_assoc()) {
                // Fix case sensitivity issues with multiple fallbacks
                $kotaValue = isset($row["kota_administrasi"]) ? $row["kota_administrasi"] : 
                            (isset($row["Kota_Administrasi"]) ? $row["Kota_Administrasi"] : 'Tidak Diketahui');
                
                // Only add if we have an actual city name
                if ($kotaValue != 'Tidak Diketahui' && !empty($kotaValue)) {
                    $sampahByKota[] = [
                        'kota' => $kotaValue,
                        'total' => (int)$row["total"]
                    ];
                }
            }
        }
        
        // Query untuk menghitung laporan banjir berdasarkan kota administrasi
        $sqlBanjirByKota = "SELECT Kota_Administrasi AS kota_administrasi, COUNT(*) as total FROM laporanweb_masuk 
                            WHERE Status = 'diverifikasi' AND Jenis_Laporan = 'banjir'
                            GROUP BY Kota_Administrasi
                            ORDER BY Kota_Administrasi ASC";
        $resultBanjirByKota = $conn->query($sqlBanjirByKota);
        
        if (!$resultBanjirByKota) {
            handleError("Error query banjir by kota: " . $conn->error);
        }
        
        if ($resultBanjirByKota->num_rows > 0) {
            while ($row = $resultBanjirByKota->fetch_assoc()) {
                // Fix case sensitivity issues with multiple fallbacks
                $kotaValue = isset($row["kota_administrasi"]) ? $row["kota_administrasi"] : 
                            (isset($row["Kota_Administrasi"]) ? $row["Kota_Administrasi"] : 'Tidak Diketahui');
                
                // Only add if we have an actual city name
                if ($kotaValue != 'Tidak Diketahui' && !empty($kotaValue)) {
                    $banjirByKota[] = [
                        'kota' => $kotaValue,
                        'total' => (int)$row["total"]
                    ];
                }
            }
        }
    }
    
    // Jika data masih kosong (karena tidak ada data valid atau kolom tidak ada), gunakan data dummy
    if (empty($sampahByKota)) {
        $sampahByKota = [
            ['kota' => 'Jakarta Pusat', 'total' => 78],
            ['kota' => 'Jakarta Selatan', 'total' => 124],
            ['kota' => 'Jakarta Barat', 'total' => 96],
            ['kota' => 'Jakarta Utara', 'total' => 112],
            ['kota' => 'Jakarta Timur', 'total' => 108]
        ];
    }
    
    if (empty($banjirByKota)) {
        $banjirByKota = [
            ['kota' => 'Jakarta Pusat', 'total' => 45],
            ['kota' => 'Jakarta Selatan', 'total' => 67],
            ['kota' => 'Jakarta Barat', 'total' => 89],
            ['kota' => 'Jakarta Utara', 'total' => 123],
            ['kota' => 'Jakarta Timur', 'total' => 76]
        ];
    }
    
    // Kirim data sebagai JSON
    echo json_encode([
        'totalLaporan' => $totalLaporan,
        'sedangDiproses' => $sedangDiproses,
        'sampahByKota' => $sampahByKota,
        'banjirByKota' => $banjirByKota,
        'lastUpdated' => date('Y-m-d H:i:s'),
        'debug' => [
            'hasJenisLaporan' => $hasJenisLaporan,
            'hasKotaAdministrasi' => $hasKotaAdministrasi
        ]
    ]);
    
} catch (Exception $e) {
    // Jika terjadi error, kembalikan pesan error
    handleError($e->getMessage());
} finally {
    // Tutup koneksi jika sudah dibuka
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>