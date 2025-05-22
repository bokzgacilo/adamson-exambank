<?php

include './config/headers.php';
require_once './config/database.php';
require_once 'SubjectController.php';
require_once './service/logger.php';

$subjects = new Subject($conn);

$action = $_GET['action'] ?? '';

switch ($action) {
  case "create":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["subject_name"])) {
      echo json_encode(["message" => "Invalid input"]);
      exit;
    }

    $result = $subjects->create($data["subject_name"]);
    create_log($conn, 'Admin', "CREATE SUBJECT -> {$data['subject_name']}");

    echo json_encode(["message" => $result ? "Subject created successfully" : "Failed to create new subject"]);
    break;
  case "viewAll":
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $subjects = $subjects->viewAll();

    echo json_encode($subjects);
    break;
  case "delete":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $subjects = $subjects->delete($data["subject_name"]);
    create_log($conn, 'Admin', "DELETE SUBJECT -> {$data['subject_name']}");
    echo json_encode($subjects);
    break;
  case "change_status":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $subjects = $subjects->change_status($data['id'], $data['status']);

    $status = "";
    if($data['status'] == 1){
      $status = "Active";
    }else {
      $status = "Inactive";
    }

    echo json_encode($subjects);
    create_log($conn, 'Admin', "UPDATE STATUS TO [$status] OF SUBJECT ID: {$data['id']}");
    break;
  case "GetAllSubjects":
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $subjects = $subjects->GetAllSubjects($_GET['type']);

    echo json_encode($subjects);
    break;
  case "GetAllDepartments":
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $subjects = $subjects->GetAllDepartments($_GET['type']);

    echo json_encode($subjects);
    break;

  default:
    echo json_encode(["message" => "Invalid action"]);
}
