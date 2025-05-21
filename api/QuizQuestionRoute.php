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


  if ($stmt->execute()) {
    echo json_encode(['message' => 'Data inserted successfully']);
    create_log($conn, $data['created_by'], "CREATE: Quiz Question: {$data['question']}");
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

  if ($stmt->execute()) {
    echo json_encode(['message' => 'Data updated successfully']);
    create_log($conn, $data['created_by'], "UPDATE: Quiz Question: {$data['question']}");
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

  // Get the question text for logging before deleting
  $stmtSelect = $conn->prepare("SELECT question FROM quiz_question WHERE id = ?");
  $stmtSelect->bind_param("i", $id);
  $stmtSelect->execute();
  $stmtSelect->bind_result($questionText);
  $stmtSelect->fetch();
  $stmtSelect->close();

  // Proceed to delete
  $stmt = $conn->prepare("DELETE FROM quiz_question WHERE id = ?");
  $stmt->bind_param("i", $id);

  if ($stmt->execute()) {
    echo json_encode(['message' => 'Data deleted successfully']);
    create_log($conn, $deleted_by, "DELETE: Quiz Question: {$questionText}");
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete data: ' . $stmt->error]);
  }

  $stmt->close();
}
?>