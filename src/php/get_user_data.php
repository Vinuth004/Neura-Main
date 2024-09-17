<?php
// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("HTTP/1.1 204 No Content");
    exit();
}

// Allow CORS from the specified origin
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json;");

$input = json_decode(file_get_contents("php://input"), true);

if (isset($input['email'])) {
    $email = $input['email'];

    // Assuming you have a MySQLi connection called $conn
    $conn = new mysqli('localhost', 'root', 'Ushankv2005@&', 'neura');

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["message" => "Database connection failed: " . $conn->connect_error]);
        exit();
    }

    // Step 1: Fetch the user ID based on the email
    $stmt = $conn->prepare("SELECT id FROM user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        $userId = $user['id'];

        // Step 2: Fetch weight, height, age, gender from the pref table based on user ID
        $stmt = $conn->prepare("SELECT `weight`, `height`, `age`, `gender` FROM `pref` WHERE `user_id` = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $prefData = $result->fetch_assoc();

        if ($prefData) {
            echo json_encode($prefData);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Preferences not found for this user"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "User not found"]);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(400);
    echo json_encode(["message" => "Email is required"]);
}
?>
