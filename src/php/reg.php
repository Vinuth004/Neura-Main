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
if (!isset($input['firstName']) || !isset($input['lastName']) || !isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid input. All fields are required."]);
    exit();
}

// Sanitize the input
$firstName = htmlspecialchars($input['firstName']);
$lastName = htmlspecialchars($input['lastName']);
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$password = password_hash($input['password'], PASSWORD_BCRYPT); // Hash the password

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

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO user (fname, lname, email, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $firstName, $lastName, $email, $password);

if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(["message" => "User registered successfully"]);
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Failed to register user: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
