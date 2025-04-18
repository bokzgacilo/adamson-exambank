<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once './config/database.php';
require_once 'StatisticsController.php';

$statistic = new Statistics($conn);

$action = $_GET['action'] ?? '';

switch ($action) {
    case "all_questions":
        if ($_SERVER["REQUEST_METHOD"] !== "GET") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }
        $stat = $statistic->all_questions();

        echo json_encode($stat);
        break;
    case "all_users":
        if ($_SERVER["REQUEST_METHOD"] !== "GET") {
            echo json_encode(["message" => "Invalid request method"]);
            exit;
        }
        $stat = $statistic->all_users();

        echo json_encode($stat);
        break;
    default:
        echo json_encode(["message" => "Invalid action"]);
}
