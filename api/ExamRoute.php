<?php
header("Access-Control-Allow-Origin: *");
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

        if (!$data || !isset($data["exam_name"], $data["subject"], $data["access_code"], $data["questions"], $data["created_by"])) {
            echo json_encode(["message" => "Invalid input"]);
            exit;
        }

        $result = $exam->create($data["exam_name"], $data["subject"], $data["access_code"], $data["questions"], $data["created_by"]);

        echo json_encode(["message" => $result ? "Exam created successfully" : "Failed to create exam"]);
        break;

    case "export":
        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);

        $exams = $exam -> export($data["data"]);

        echo json_encode($exams);
        break;
    case "getAllQuestion":
        if ($_SERVER["REQUEST_METHOD"] !== "GET") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }
        $subject = $_GET['subject'];

        $exams = $exam->getAllQuestion($subject);

        echo json_encode($exams);
        break;
    case "viewAll":
        if ($_SERVER["REQUEST_METHOD"] !== "GET") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }
        $subject = $_GET['subject'];

        $exams = $exam->viewAll($subject);

        echo json_encode($exams);
        break;

    default:
        echo json_encode(["message" => "Invalid action"]);
}
