<?php
  header("Access-Control-Allow-Origin: http://localhost:5173");
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  header("Content-Type: application/json");

  include("../../config/database.php");

  $data = json_decode(file_get_contents("php://input"), true);

  $username = $conn -> real_escape_string($data['username']);
  $password = $data['password'];

  $stmt = $conn->prepare("SELECT * FROM user WHERE username = ? AND password = ?");
  $stmt->bind_param("ss", $username, $password);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode($row);
  } else {
    echo json_encode(["error" => "User not found"]);
  }

  $stmt->close();
  $conn->close();
?>