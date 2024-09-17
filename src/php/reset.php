<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

$host = 'localhost'; // or your database host
$dbname = 'neura'; // replace with your database name
$username = 'root'; // replace with your database username
$password = 'Ushankv2005@&'; // replace with your database password

// Create a new connection to the MySQL database
$conn = new mysqli($host, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the JSON input from the request
$data = json_decode(file_get_contents('php://input'), true);

// Validate and sanitize inputs
if (isset($data['email']) && isset($data['password'])) {
    $email = $conn->real_escape_string($data['email']);
    $newPassword = $conn->real_escape_string($data['password']);

    // Hash the new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Prepare the SQL query
    $sql = "UPDATE user SET password = ? WHERE email = ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt) {
        $stmt->bind_param('ss', $hashedPassword, $email);

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(["message" => "Password updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update password."]);
        }

        // Close the statement
        $stmt->close();
    } else {
        echo json_encode(["message" => "Failed to prepare the SQL statement."]);
    }
} else {
    echo json_encode(["message" => "Invalid input."]);
}

// Close the database connection
$conn->close();
?>
