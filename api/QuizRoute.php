<?php
include './config/headers.php';
require_once './config/database.php';
require_once 'QuizController.php';

$quiz = new Quiz($conn);

$action = $_GET['action'] ?? '';

switch ($action) {
  case 'get_quizzes':
    $usertype = $_GET['usertype'] ?? '';
    $fullname = $_GET['fullname'] ?? '';

    $result = $quiz->getQuizzes($usertype, $fullname);

    header('Content-Type: application/json');
    echo json_encode($result);
    break;
  case "get_available_questions":
    $department = $_GET['department'] ?? '';
    $subject = $_GET['subject'] ?? '';

    $stmt = $conn->prepare("SELECT * FROM question WHERE department = ? AND subject = ? AND status = 1");
    $stmt->bind_param("ss", $department, $subject);
    $stmt->execute();
    $result = $stmt->get_result();
    $questions = [];

    while ($row = $result->fetch_assoc()) {
      $questions[] = $row;
    }

    // Return JSON
    header('Content-Type: application/json');
    echo json_encode($questions);

    $stmt->close();
    $conn->close();

    break;
  case "create":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
      echo json_encode(["message" => "No JSON received"]);
      exit;
    }

    if (!isset($data["quiz_name"], $data["subject"], $data["department"], $data["questions"], $data["created_by"])) {
      echo json_encode(["message" => "Invalid input"]);
      exit;
    }

    $newQuiz = $quiz->create(
      $data["quiz_name"],
      $data["subject"],
      $data["department"],
      $data["questions"],
      $data["created_by"]
    );

    if ($newQuiz) {
      echo json_encode([
        "message" => "Quiz created successfully",
        "question" => $newQuiz
      ]);
    } else {
      echo json_encode(["message" => "Failed to create quiz"]);
    }

    break;
  case 'delete':
    $id = $_GET['id'] ?? null;
    if ($id) {
      
      $newQuiz = $quiz->delete(
        $id,
      );

      if ($newQuiz) {
        echo json_encode([
          "message" => "Quiz deleted successfully",
          "question" => $newQuiz
        ]);
      }
    } else {
      echo json_encode(['success' => false, 'message' => 'Quiz ID is required']);
    }
    break;
  default:
    echo json_encode(["message" => "Invalid action"]);
}
