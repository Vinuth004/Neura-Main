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

$email = $data['email'];
$weight = $data['weight'];
$height = $data['height'];
$age = $data['age'];
$allergies = $data['allergies'];
$preferences = $data['preferences'];
$gender = $data['gender'];

// Find the user's id based on the email
$sql = "SELECT id FROM user WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $user_id = $row['id'];

    // Check if data already exists for this user_id in the 'pref' table
    $sql_check = "SELECT * FROM pref WHERE user_id = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("i", $user_id);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows > 0) {
        // If data exists, perform an update
        $sql_update = "UPDATE pref SET weight = ?, height = ?, age = ?, allergies = ?, preferences = ?, gender = ? WHERE user_id = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("ddssssi", $weight, $height, $age, $allergies, $preferences,$gender, $user_id);

        if ($stmt_update->execute()) {
            echo json_encode(["message" => "Customization data updated successfully."]);
        } else {
            echo json_encode(["message" => "Failed to update customization data."]);
        }

        $stmt_update->close();
    } else {
        // If no data exists, perform an insert
        $sql_insert = "INSERT INTO pref (user_id, weight, height, age, allergies, preferences, gender) VALUES (?, ?, ?, ?, ?, ?,?)";
        $stmt_insert = $conn->prepare($sql_insert);
        $stmt_insert->bind_param("iddssss", $user_id, $weight, $height, $age, $allergies, $preferences,$gender);

        if ($stmt_insert->execute()) {
            echo json_encode(["message" => "Customization data saved successfully."]);
        } else {
            echo json_encode(["message" => "Failed to save customization data."]);
        }

        $stmt_insert->close();
    }

    $stmt_check->close();
} else {
    echo json_encode(["message" => "User not found."]);
}

$stmt->close();
$conn->close();
?>
