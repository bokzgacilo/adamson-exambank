<?php
include './config/headers.php';
require_once './config/database.php';
require_once 'UserController.php';
require_once 'service/logger.php';
$user = new User($conn);
$action = $_GET['action'] ?? '';
switch ($action) {
  case "create":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data || !isset($data["name"], $data["role"], $data["assigned_subject"], $data["username"], $data["password"])) {
      echo json_encode(["message" => "Invalid input"]);
      exit;
    }
    $assigned_subjects = json_encode($data["assigned_subject"]);
    $assigned_department = json_encode($data["assigned_department"]);

    $result = $user->create($data["name"], $data["role"], $assigned_subjects, $assigned_department, $data["username"], $data["password"]);
    echo json_encode(["message" => $result ? "User created successfully" : "Failed to create user"]);
    create_log($conn, 'Admin', "Create: User #{$data['name']}.");
    break;
  case "viewAll":
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $users = $user->viewAll();
    echo json_encode($users);
    break;
  case "change_type":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $users = $user->change_type($data['id'], $data['type']);
    echo json_encode($users);
    create_log($conn, 'Admin', "Update: Type of User #{$data['id']}.");
    break;
  case "change_status":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $users = $user->change_status($data['id'], $data['status']);
    create_log($conn, 'Admin', "Update: Status of User #{$data['id']}.");
    echo json_encode($users);
    break;
  case "change_password":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $users = $user->change_password($data['id'], $data['password']);
    echo json_encode($users);
    create_log($conn, $data['id'], "Update: Password of User #{$data['id']}.");
    break;
  case "delete":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $users = $user->delete($data['id']);
    echo json_encode($users);
    break;

  case "change_avatar":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    if (!isset($_POST['id']) || !isset($_POST['password'])) {
      echo json_encode(["message" => "Missing required fields"]);
      exit;
    }

    $id = $_POST['id'];
    $password = $_POST['password'];
    $avatar = isset($_FILES['avatar']) ? $_FILES['avatar'] : null;

    $users = $user->change_avatar($id, $avatar, $password);
    echo json_encode(["success" => $users]);
    create_log($conn, $id, "Update: Account Image of User #{$id}.");
    break;

  case "update_subjects":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input['id']) || !is_array($input['userSubjects'])) {
      echo json_encode(["message" => "Missing or invalid required fields"]);
      exit;
    }

    $id = (int) $input['id'];
    $usersubjects = $input['userSubjects'];

    $users = $user->update_subjects($id, $usersubjects);
    echo json_encode(["success" => $users]);
    create_log($conn, "Admin", "Update: Assigned Subjects of User #{$input['id']}: Changed to '" . implode(", ", $usersubjects) . "'.");
    break;
  case "update_departments":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $input = json_decode(file_get_contents("php://input"), true);
    if (!isset($input['id']) || !is_array($input['userDepartments'])) {
      echo json_encode(["message" => "Missing or invalid required fields"]);
      exit;
    }
    $id = (int) $input['id'];
    $userDepartments = $input['userDepartments'];
    $users = $user->update_departments($id, $userDepartments);
    echo json_encode(["success" => $users]);
    create_log($conn, "Admin", "Update: Assigned Departments of User #{$input['id']}: Changed to '" . implode(", ", $userDepartments) . "'.");
    break;
  case "get_user_data":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $users = $user->get_user_data($data['id']);
    echo json_encode($users);
    break;
  case "login":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $users = $user->login($data['username'], $data['password']);
    $decodedUsers = json_decode($users, true);
    if (isset($decodedUsers['error'])) {
      echo json_encode(["success" => false, "message" => $decodedUsers['error']]);
    } else {
      create_log($conn,  $decodedUsers['name'], "Logged in.");
      echo json_encode(["success" => true, "user" => $decodedUsers]);
    }
    break;
  default:
    echo json_encode(["message" => "Invalid action"]);
}
