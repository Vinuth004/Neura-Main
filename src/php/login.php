<?php
// Allow CORS requests from any origin (adjust the domain as needed)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Proceed with handling the POST request
header("Content-Type: application/json");

// Get the raw POST data
$data = file_get_contents("php://input");

// Decode the JSON data into a PHP array
$input = json_decode($data, true);

// Check if the required fields are present
if (!isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid input. Both fields are required."]);
    exit();
}

// Sanitize the input
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$password = htmlspecialchars($input['password']);

// Database connection settings
$servername = "localhost"; // Replace with your server name
$username = "root"; // Replace with your database username
$password_db = "Ushankv2005@&"; // Replace with your database password
$dbname = "neura"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password_db, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Prepare and execute query to check user credentials
$stmt = $conn->prepare("SELECT password FROM user WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($hashed_password);
    $stmt->fetch();

    if (password_verify($password, $hashed_password)) {
        // Successful login
        http_response_code(200);
        echo json_encode(["message" => "Login successful"]);
    } else {
        // Invalid password
        http_response_code(401);
        echo json_encode(["message" => "Invalid credentials"]);
    }
} else {
    // Email not found
    http_response_code(401);
    echo json_encode(["message" => "Invalid credentials"]);
}

$stmt->close();
$conn->close();
?>
