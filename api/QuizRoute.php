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
    $data = json_decode(file_get_contents("php://input"), true);
    $department = $_GET['department'] ?? '';
    $subject = $_GET['subject'] ?? '';
    $module = $_GET['module'] ?? '';
    $category = $_GET['category'] ?? '';
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    $offset = ($page - 1) * $limit;

    $where = "WHERE 1=1";
    $params_type = "";
    $params = [];

    // Subject filter (if not "All")
    if ($subject !== "All") {
      $where .= " AND subject = ?";
      $params_type .= "s";
      $params[] = $subject;
    }

    if ($module !== "All") {
      $where .= " AND module = ?";
      $params_type .= "s";
      $params[] = $module;
    }

    if ($category !== "All") {
      $where .= " AND category = ?";
      $params_type .= "s";
      $params[] = $category;
    }

    if ($department !== "All") {
      $where .= " AND department = ?";
      $params_type .= "s";
      $params[] = $department;
    }
    $query = "SELECT id, question, options, department, category, module, subject 
              FROM quiz_question 
              $where
              LIMIT ?, ?";
    $stmt = $conn->prepare($query);
    $types = $params_type . "ii";
    $values = array_merge($params, [$offset, $limit]);
    $stmt->bind_param($types, ...$values);
    $stmt->execute();
    $result = $stmt->get_result();
    $questions = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    // Count total
    $countQuery = "SELECT COUNT(*) as total 
                   FROM quiz_question  
                   $where";
    $countStmt = $conn->prepare($countQuery);
    if(count($params) !== 0){
      $countStmt->bind_param($params_type, ...$params);
    }
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $total = $countResult->fetch_assoc()["total"];
    $countStmt->close();

    $conn->close();

    echo json_encode([
      "questions" => $questions,
      "total" => intval($total)
    ]);
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
