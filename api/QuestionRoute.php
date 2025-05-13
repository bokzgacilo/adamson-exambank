<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once './config/database.php';
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
    case "QuestionForBank":
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        $questions = $question->QuestionForBank($data["subject"]);

        print_r($questions);
        break;
    case "delete":
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $questions = $question->delete($data["id"]);

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
