<?php
session_start();
include './config/headers.php';
require_once './config/database.php';
require_once './service/logger.php';
require_once 'QuestionController.php';
$question = new Question($conn);
$action = $_GET['action'] ?? '';

switch ($action) {
  case "create":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["question"], $data["options"], $data["answer"], $data["category"], $data["created_by"], $data["subject"], $data["classification"])) {
      echo json_encode(["message" => "Invalid input"]);
      exit;
    }

    $optionsJson = json_encode($data["options"]);
    $answerJson = json_encode($data["answer"]);
    $termJson = json_encode($data["terms"]);

    $newQuestion = $question->create(
      $data["question"],
      $optionsJson,
      $data["department"],
      $answerJson,
      $data["category"],
      $data["created_by"],
      $data["subject"],
      $termJson,
      $data["classification"]
    );

    if ($newQuestion) {
      create_log($conn, $data["created_by"], "CREATE: Question {$data['question']}.");

      echo json_encode([
        "message" => "Question created successfully",
        "question" => $newQuestion
      ]);
    } else {
      echo json_encode(["message" => "Failed to create question"]);
    }
    break;
  case "update":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["question"], $data["options"], $data["answer"], $data["category"], $data["created_by"], $data["subject"], $data["classification"])) {
      echo json_encode(["message" => "Invalid input"]);
      exit;
    }

    $optionsJson = json_encode($data["options"]);
    $answerJson = json_encode($data["answer"]);
    $termJson = json_encode($data["terms"]);

    $newQuestion = $question->update(
      $data["id"],
      $data["question"],
      $data['department'],
      $optionsJson,
      $answerJson,
      $data["category"],
      $data["created_by"],
      $data["subject"],
      $termJson,
      $data["classification"]
    );

    if ($newQuestion) {
      create_log($conn, $data["created_by"], "UPDATE: Question: {$data['id']}.");
      echo json_encode([
        "message" => "Question created successfully",
        "question" => $newQuestion
      ]);
    } else {
      echo json_encode(["message" => "Failed to create question"]);
    }
    break;

  case "viewAll":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }


    $data = json_decode(file_get_contents("php://input"), true);

    $questions = $question->viewAll($data["subject"], $data['type']);

    print_r($questions);
    break;
  case "get_all_questions_with_pagination":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $subject = $data["subject"] ?? null;
    $page = isset($data["page"]) ? intval($data["page"]) : 1;
    $limit = isset($data["limit"]) ? intval($data["limit"]) : 10;
    $classification = $data["classification"] ?? "";
    $category = $data["category"] ?? "";
    $term = $data["term"] ?? "";
    $department = $data["department"] ?? "";
    $offset = ($page - 1) * $limit;
    $where = "";
    $params_type = "";
    $params = [];

    if ($classification !== "All") {
      $where .= " AND classification = ?";
      $params_type .= "s";
      $params[] = $classification;
    }

    if ($category !== "All") {
      $where .= " AND category = ?";
      $params_type .= "s";
      $params[] = $category;
    }

    if ($term !== "All") {
      $where .= " AND terms LIKE ?";
      $params_type .= "s";
      $params[] = '%' . $term . '%';  // or '%"Prelims"%'
    }

    if ($department !== "All") {
      $where .= " AND department = ?";
      $params_type .= "s";
      $params[] = $department;
    }

    $query = "SELECT id, question, options, department, category, classification, terms 
      FROM question 
      WHERE subject = ?
      $where
      LIMIT ?, ?";
    $stmt = $conn->prepare($query);

    if (is_array($params) && count($params) > 0) {
      $types = "s" . $params_type . "ii";
      $values = array_merge([$subject], $params, [$offset, $limit]);
      $stmt->bind_param($types, ...$values);
    } else {
      $stmt->bind_param("sii", $subject, $offset, $limit);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $questions = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // 🔢 Count total questions
    $countQuery = "SELECT COUNT(*) as total 
    FROM question  
      WHERE subject = ?
      $where";

    $countStmt = $conn->prepare($countQuery);

    if (is_array($params) && count($params) > 0) {
      $types = "s" . $params_type;
      $values = array_merge([$subject], $params);
      $countStmt->bind_param($types, ...$values);
    } else {
      $countStmt->bind_param("s", $subject);
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
  case "delete":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $questions = $question->delete($data["id"]);
    print_r($questions);
    echo json_encode($questions);
    break;
  case "disable":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $questions = $question->toggle_status($data["id"]);

    echo json_encode($questions);
    break;
  case "enable":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $questions = $question->toggle_status($data["id"]);

    echo json_encode($questions);
    break;

  default:
    echo json_encode(["message" => "Invalid action"]);
}
