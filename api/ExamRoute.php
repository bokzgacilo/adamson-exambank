<?php
include './config/headers.php';
require_once './config/database.php';
require_once './service/logger.php';
require_once 'ExamController.php';

$exam = new Exam($conn);

$action = $_GET['action'] ?? '';

switch ($action) {
  case "create":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["exam_name"], $data["subject"], $data["access_code"], $data["tos"], $data["questions"], $data["created_by"])) {
      echo json_encode(["message" => "Invalid input"]);
      exit;
    }

    $usertype = $data['usertype'];
    $department = $usertype === "Admin" ? "Admin" : $data['department'];

    $result = $exam->create($data["exam_name"], $data["subject"], $data["access_code"], $data["tos"], $data["questions"], $data["created_by"]);
    create_log($conn, $data['created_by'], "CREATE EXAM [$department] -> {$data['exam_name']}");
    echo json_encode(["message" => $result ? "Exam created successfully" : "Failed to create exam"]);
    break;

  case "export":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        echo json_encode(["message" => "Invalid request method"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $name = $data['name'];
    $test_name = $data['test_name'];
    $type = $data['type'];

    $usertype = $data['usertype'];
    $department = $usertype === "Admin" ? "Admin" : $data['department'];

    $filePath = $exam->export($data["data"], $data["subject"]); // Returns full path to .txt file
    create_log($conn, $name, "EXPORT $type [$department] -> $test_name");
    if (file_exists($filePath)) {
        header("Content-Type: text/plain");
        header("Content-Disposition: attachment; filename=\"EXPORT.txt\"");
        header("Content-Length: " . filesize($filePath));
        readfile($filePath);
        exit;
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Export file not found"]);
    }
    break;
  case "GenerateTOSQuestion":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["success" => false, "message" => "Invalid request method"]);
      exit;
    }
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['tos']) || empty($input['tos'])) {
      echo json_encode(["success" => false, "message" => "TOS parameter is required"]);
      exit;
    }

    $tos = $input['tos'];

    if (!is_array($tos)) {
      echo json_encode(["success" => false, "message" => "Invalid TOS format"]);
      exit;
    }
    $full_tos = [];

    // Iterate through each classification in the input
    foreach ($input['tos'] as $tos_item) {
      // Sum all the values in the categories array
      $category_sum = array_sum($tos_item['categories']);
      // Add the classification and its summed category value to the full_tos array
      $full_tos[$tos_item['classification']] = $category_sum;
    }

    $exams = $exam->GenerateTOSQuestion($tos, $input['subject']);

    echo json_encode(["success" => true, "data" => $exams, "tos" => $full_tos]);
    break;
  case "viewAll":
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $subjects = $_GET['subjects'];
    $type = $_GET['type'];
    $fullname = $_GET['fullname'];
    $exams = $exam->viewAll($subjects, $type, $fullname);

    echo json_encode($exams);
    break;
  case "delete":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $creator = $data['created_by'];

    $usertype = $data['usertype'];
    $department = $usertype === "Admin" ? "Admin" : $data['department'];

    $exams = $exam->delete($data["id"]);
    create_log($conn, $creator, "DELETE EXAM [$department] ID: {$data['id']}");
    echo json_encode($exams);
    break;
  case "change_status":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $exams = $exam->change_status($data['id'], $data['status']);
    echo json_encode($exams);
    break;
  case "update":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $created_by = $data['created_by'];
    $usertype = $data['usertype'];
    $department = $usertype === "Admin" ? "Admin" : $data['department'];
    create_log($conn, $created_by, "UPDATE EXAM [$department] ID: {$data['examid']}");
    $exams = $exam->update($data["examid"], $data["questions"]);
    echo json_encode($exams);
    break;
  default:
    echo json_encode(["message" => "Invalid action"]);
}
