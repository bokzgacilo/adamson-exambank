<?php
require_once './config/headers.php';
require_once './config/database.php';
require_once 'UserController.php';

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

    $result = $user->create($data["name"], $data["role"], $assigned_subjects, $data["username"], $data["password"]);

    echo json_encode(["message" => $result ? "User created successfully" : "Failed to create user"]);
    break;

  case "viewAll":
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $users = $user->viewAll();
    echo json_encode($users);
    break;
  case "change_status":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }
    $data = json_decode(file_get_contents("php://input"), true);
    $users = $user->change_status($data['id'], $data['status']);
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
    $usersubjects = $input['userDepartments'];

    $users = $user->update_departments($id, $usersubjects);
    echo json_encode(["success" => $users]);
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
      echo json_encode(["success" => true, "user" => $decodedUsers]);
    }
    break;
  default:
    echo json_encode(["message" => "Invalid action"]);
}
