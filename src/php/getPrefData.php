<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Database connection
$servername = "localhost";
$username = "root";
$password = "Ushankv2005@&";
$dbname = "neura";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the input data from the POST request
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['token'];

// Find the user's id based on the email
$sql = "SELECT `id` FROM `user` WHERE `email` = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $user_id = $row['id'];

    // Fetch data from 'pref' table
    $sql_pref = "SELECT `weight`, `height`, `age`, `allergies`, `preferences` , `gender` FROM `pref` WHERE `user_id` = ?";
    $stmt_pref = $conn->prepare($sql_pref);
    $stmt_pref->bind_param("i", $user_id);
    $stmt_pref->execute();
    $result_pref = $stmt_pref->get_result();

    if ($result_pref->num_rows > 0) {
        $pref_data = $result_pref->fetch_assoc();
        echo json_encode(array_merge(["success" => true], $pref_data));
    } else {
        echo json_encode(["success" => false, "message" => "No preferences found for this user."]);
    }

    $stmt_pref->close();
} else {
    echo json_encode(["success" => false, "message" => "User not found."]);
}

$stmt->close();
$conn->close();
?>
