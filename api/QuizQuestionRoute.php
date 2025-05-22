<?php
include './config/headers.php';
require_once './config/database.php';
require_once './service/logger.php';
require_once './vendor/autoload.php';

header("Content-Type: application/json");

use PhpOffice\PhpSpreadsheet\IOFactory;

$route = isset($_GET['route']) ? $_GET['route'] : null;
$inputData = json_decode(file_get_contents("php://input"), true);

switch ($route) {
  case 'create':
    create($inputData);
    break;
  case 'get_all':
    get_all($inputData);
    break;
  case 'update':
    update($inputData);
    break;
  case 'delete':
    delete($inputData);
    break;
  default:
    http_response_code(400);
    echo json_encode(['error' => 'Invalid route']);
    break;
}

function create($data)
{
  global $conn;

  $optionsJson = json_encode($data["options"]);
  $answerJson = json_encode($data["answer"]);

  $stmt = $conn->prepare("
        INSERT INTO quiz_question (question, options, answer, category, created_by, subject, department, module)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

  $stmt->bind_param(
    'ssssssss',
    $data['question'],
    $optionsJson,
    $answerJson,
    $data['category'],
    $data['created_by'],
    $data['subject'],
    $data['department'],
    $data['module']
  );

  $usertype = $data['usertype'];
  $department = $usertype === "Admin" ? "Admin" : $data['user_department'];

  if ($stmt->execute()) {
    echo json_encode(['message' => 'Data inserted successfully']);
    create_log($conn, $data['created_by'], "CREATE QUIZ QUESTION [$department] -> {$data['question']}");
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to insert data: ' . $stmt->error]);
  }

  $stmt->close();
}

function get_all($data)
{
  global $conn;

  $fullname = $data['fullname'];
  $type = $data['type'];

  if ($type === 'admin') {
    $sql = "SELECT * FROM quiz_question";
    $stmt = $conn->prepare($sql);
  } else {
    $sql = "SELECT * FROM quiz_question WHERE created_by = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $fullname);
  }

  $stmt->execute();
  $result = $stmt->get_result();

  // Normally you would fetch this from a database
  $questions = [];
  while ($row = $result->fetch_assoc()) {
    // Decode options from JSON string to array (optional)
    if (isset($row['options'])) {
      $row['options'] = json_decode($row['options'], true);
    }
    $questions[] = $row;
  }

  echo json_encode([
    'message' => 'Data fetched successfully',
    'data' => $questions
  ]);

  $stmt->close();
}

function update($data)
{
  global $conn;

  $optionsJson = json_encode($data["options"]);
  $answerJson = json_encode($data["answer"]);

  $stmt = $conn->prepare("
        UPDATE quiz_question 
        SET question = ?, 
            options = ?, 
            answer = ?, 
            category = ?, 
            created_by = ?, 
            subject = ?, 
            department = ?, 
            module = ?
        WHERE id = ?
    ");

  $stmt->bind_param(
    'ssssssssi',
    $data['question'],
    $optionsJson,
    $answerJson,
    $data['category'],
    $data['created_by'],
    $data['subject'],
    $data['department'],
    $data['module'],
    $data['id'] // Make sure this key exists in the $data array
  );

  $usertype = $data['usertype'];
  $department = $usertype === "Admin" ? "Admin" : $data['user_department'];

  if ($stmt->execute()) {
    echo json_encode(['message' => 'Data updated successfully']);
    create_log($conn, $data['created_by'], "UPDATE QUIZ QUESTION [$department] ID: {$data['id']}");
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update data: ' . $stmt->error]);
  }

  $stmt->close();
}
function delete($data)
{
  global $conn;

  $id = $data['id'];
  $deleted_by = $data['deleted_by'];
  $usertype = $data['usertype'];
  $department = $usertype === "Admin" ? "Admin" : $data['department'];

  // Proceed to delete
  $stmt = $conn->prepare("DELETE FROM quiz_question WHERE id = ?");
  $stmt->bind_param("i", $id);

  if ($stmt->execute()) {
    echo json_encode(['message' => 'Data deleted successfully']);
    create_log($conn, $deleted_by, "DELETE QUIZ QUESTION [$department] ID: {$id}");
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete data: ' . $stmt->error]);
  }

  $stmt->close();
}
?>