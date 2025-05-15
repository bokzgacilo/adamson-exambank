<?php
$allowed_origins = [
    'http://localhost:5137',
    'http://localhost/exam-bank',
    'https://exam-bank.site',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true"); // Optional, only if you send cookies
}
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once './config/database.php';
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

    $result = $exam->create($data["exam_name"], $data["subject"], $data["access_code"], $data["tos"], $data["questions"], $data["created_by"]);

    echo json_encode(["message" => $result ? "Exam created successfully" : "Failed to create exam"]);
    break;

  case "export":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $exams = $exam->export($data["data"], $data["subject"]);

    echo json_encode($exams);
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
    $exams = $exam->viewAll($subjects, $type);

    echo json_encode($exams);
    break;
  case "delete":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $exams = $exam->delete($data["id"]);

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

    $exams = $exam -> update($data["examid"], $data["questions"]);

    echo json_encode($exams);
    break;
  default:
    echo json_encode(["message" => "Invalid action"]);
}
