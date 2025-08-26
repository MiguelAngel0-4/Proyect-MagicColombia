<?php
// api/products.php
header('Content-Type: application/json; charset=utf-8');

$DB_HOST = 'localhost';
$DB_NAME = 'TU_BASE';
$DB_USER = 'root';        // XAMPP por defecto
$DB_PASS = '';            // XAMPP por defecto

try {
  $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);

  $stmt = $pdo->query("
    SELECT id, name, price, category, img, tags, created_at
    FROM products
    WHERE active = 1
    ORDER BY created_at DESC
  ");

  $rows = $stmt->fetchAll();

  // Si 'tags' es TEXT/CSV conviértelo a array; si es JSON en MySQL 5.7+ déjalo tal cual.
  foreach ($rows as &$r) {
    if (isset($r['tags']) && is_string($r['tags']) && $r['tags'] !== '') {
      $decoded = json_decode($r['tags'], true);
      $r['tags'] = $decoded ?: preg_split('/\s*,\s*/', $r['tags']);
    }
    $r['price'] = (int)$r['price'];
  }

  echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'DB_ERROR', 'message' => $e->getMessage()]);
}
