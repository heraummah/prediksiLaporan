<?php
// Konfigurasi koneksi database
$host = "localhost";
$username = "root"; // Ganti dengan username database Anda
$password = ""; // Ganti dengan password database Anda, biarkan kosong jika tidak ada
$database = "sistem_prediksi"; // Ganti dengan nama database Anda

// Buat koneksi
$conn = new mysqli($host, $username, $password, $database);

// Periksa koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Set karakter set ke UTF-8
$conn->set_charset("utf8");