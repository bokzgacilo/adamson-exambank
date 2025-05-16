<?php

include './config/headers.php';
require_once './vendor/autoload.php';
require_once './config/database.php';
require_once './service/mailer.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$action = $_GET['action'] ?? '';

function insertQuestion($question, $options, $category, $classification, $created_by, $subject, $terms)
{
  global $conn;

  $sql = "INSERT INTO question (question, options, category, classification, created_by, subject, terms) 
          VALUES (?, ?, ?, ?, ?, ?, ?)";

  if ($stmt = $conn->prepare($sql)) {
    $jsonOptions = json_encode($options); // Convert array to JSON

    $stmt->bind_param("sssssss", $question, $jsonOptions, $category, $classification, $created_by, $subject, $terms);

    if ($stmt->execute()) {
      $insertedId = $stmt->insert_id; // Get last inserted ID
      $stmt->close();
      return $insertedId;
    } else {
      return "Error: " . $stmt->error;
    }
  } else {
    return "Error: " . $conn->error;
  }
}


function convertToLegendArray($baseString)
{
  $legend = [
    "1" => "Prelims",
    "2" => "Midterms",
    "3" => "Finals"
  ];
  $keys = explode(",", $baseString);
  $result = array_map(function ($key) use ($legend) {
    return $legend[trim($key)] ?? "";
  }, $keys);
  return array_filter($result);
}

function create_department($name)
{
  global $conn;

  $sql = "INSERT INTO department (name) VALUES (?)";
  $stmt = $conn->prepare($sql);

  if (!$stmt) {
    return false;
  }

  $stmt->bind_param("s", $name);
  $result = $stmt->execute();
  $stmt->close();

  return $result;
}

function get_all_departments()
{
  global $conn;

  $sql = "SELECT * FROM department ORDER BY id DESC";
  $result = $conn->query($sql);

  $departments = [];
  while ($row = $result->fetch_assoc()) {
    $departments[] = $row;
  }

  return $departments;
}

function delete_department($id)
{
  global $conn;

  $sql = "DELETE FROM department WHERE id = ?";
  $stmt = $conn->prepare($sql);
  if (!$stmt)
    return false;

  $stmt->bind_param("i", $id);
  $result = $stmt->execute();
  $stmt->close();

  return $result;
}

function update_department($id, $name)
{
  global $conn;

  $sql = "UPDATE department SET name = ? WHERE id = ?";
  $stmt = $conn->prepare($sql);
  if (!$stmt)
    return false;

  $stmt->bind_param("si", $name, $id);
  $result = $stmt->execute();
  $stmt->close();

  return $result;
}

switch ($action) {
  case "ProcessQuestionBatch":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $fileTmpPath = $_FILES["excel_data"]["tmp_name"];

    $subject = $_POST['subject'];
    $creator = $_POST['creator'];

    try {
      $spreadsheet = IOFactory::load($fileTmpPath);
      $sheet = $spreadsheet->getSheetByName("INPUT SHEET");

      if (!$sheet) {
        echo json_encode(["status" => "not-found", "message" => "INPUT SHEET not found", "description" => "You are using wrong/incompatible template, please download the template from this website."]);
        exit;
      }

      $highestRow = $sheet->getHighestRow(); // Get the last row with data
      $columns = range("A", "L"); // Columns A to L
      $data = [];

      for ($row = 3; $row <= $highestRow; $row++) {
        $rowData = [];
        $isEmpty = true;
        $option = null;

        foreach ($columns as $column) {
          $cellValue = $sheet->getCell($column . $row)->getValue();
          $rowData[$column] = $cellValue;

          if (!empty($cellValue)) {
            $isEmpty = false;
          }
        }

        if (isset($rowData["B"]) && strtoupper($rowData["B"]) === "EN") {
          $option = [
            [
              "id" => 1,
              "option" => $rowData["D"] ?? null,
              "is_correct" => (isset($rowData["E"]) && in_array(strtolower($rowData["E"]), ["x"])) ? true : "" // Blank if no 'X' or 'x'
            ]
          ];
        }

        if (isset($rowData["B"]) && in_array(strtoupper($rowData["B"]), ["ID", "NUM"])) {
          $option = [
            [
              "id" => 1,
              "option" => $rowData["D"] ?? null,
              "is_correct" => (isset($rowData["E"]) && in_array(strtolower($rowData["E"]), ["x"])) ? true : "" // Blank if no 'X' or 'x'
            ]
          ];
        }

        if (isset($rowData["B"]) && strtoupper($rowData["B"]) === "TF") {
          $option = [
            [
              "id" => 1,
              "option" => "True",
              "is_correct" => (isset($rowData["E"]) && in_array(strtolower($rowData["E"]), ["x"])) ? true : ""
            ],
            [
              "id" => 2,
              "option" => "False",
              "is_correct" => (isset($rowData["G"]) && in_array(strtolower($rowData["G"]), ["x"])) ? true : ""
            ]
          ];
        }

        if (isset($rowData["B"]) && strtoupper($rowData["B"]) === "MC") {
          $option = [
            [
              "id" => 1,
              "option" => $rowData["D"] ?? null,
              "is_correct" => (isset($rowData["E"]) && in_array(strtolower($rowData["E"]), ["x"])) ? true : "" // Blank if no 'X' or 'x'
            ],
            [
              "id" => 2,
              "option" => $rowData["F"] ?? null,
              "is_correct" => (isset($rowData["G"]) && in_array(strtolower($rowData["G"]), ["x"])) ? true : "" // Blank if no 'X' or 'x'
            ],
            [
              "id" => 3,
              "option" => $rowData["H"] ?? null,
              "is_correct" => (isset($rowData["I"]) && in_array(strtolower($rowData["I"]), ["x"])) ? true : "" // Blank if no 'X' or 'x'
            ],
            [
              "id" => 4,
              "option" => $rowData["J"] ?? null,
              "is_correct" => (isset($rowData["K"]) && in_array(strtolower($rowData["K"]), ["x"])) ? true : "" // Blank if no 'X' or 'x'
            ]
          ];
        }

        $category = "";

        switch ($rowData["B"]) {
          case "NUM":
            $category = "Numeric";
            break;
          case "TF":
            $category = "True/False";
            break;
          case "MC":
            $category = "Multiple";
            break;
          case "ID":
            $category = "Identification";
            break;
        }

        $classification = "";
        switch ($rowData["A"]) {
          case "KN":
            $classification = "Knowledge";
            break;
          case "CO":
            $classification = "Comprehension";
            break;
          case "AP":
            $classification = "Application";
            break;
          case "AN":
            $classification = "Analysis";
            break;
          case "SY":
            $classification = "Synthesis";
            break;
          case "EV":
            $classification = "Evaluation";
            break;
        }

        $Json = [
          "category" => $category,
          "classification" => $classification,
          "created_by" => $creator,
          "options" => $option,
          "question" => $rowData["C"],
          "terms" => convertToLegendArray($rowData["L"])
        ];


        if (!$isEmpty) {
          $data[] = $Json;
          insertQuestion($rowData["C"], $option, $category, $classification, $creator, $subject, json_encode(convertToLegendArray($rowData["L"])));
        }
      }

      echo json_encode(["data" => $data]);
    } catch (Exception $e) {
      echo json_encode(["message" => "Error processing file", "error" => $e->getMessage()]);
    }
    break;
  case "reset_password":
    $email = $_POST['email'];

    $newPassword = generateRandomPassword();

    $query = "SELECT name FROM user WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute(); // Optional: check $stmt->affected_rows
    $stmt->bind_result($name);
    if ($stmt->fetch()) {
      $stmt->close();
      $client_name = $name;
      $updateQuery = "UPDATE user SET password = ? WHERE username = ?";
      $updateStmt = $conn->prepare($updateQuery);
      $updateStmt->bind_param("ss", $newPassword, $email);
      $updateStmt->execute();

      if (sendPasswordResetEmail($newPassword, $email, $client_name)) {
        echo json_encode(["status" => "success", "message" => "Password Reset", "description" => "User password successfully reset. New password was sent to their email"]);
      } else {
        echo json_encode(["error" => "Resetting password error"]);
        exit();
      }
    } else {
      echo json_encode(["status" => "no-user-found", "message" => "Email is not registerd", "description" => "Email provided is not registered to exam bank. Please contact Administrator for more details."]);
      exit();
    }
    break;
  case "upload_tos":
    $fileTmpPath = $_FILES["file"]["tmp_name"];

    if ($_FILES["file"]["error"] !== UPLOAD_ERR_OK) {
      die(json_encode(["error" => "File upload failed!"]));
    }

    try {
      $spreadsheet = IOFactory::load($fileTmpPath);
      $sheet = $spreadsheet->getActiveSheet();

      $fields = [
        [
          'classification' => 'Knowledge',
          'categories' => [
            'Identification' => 'B3',
            'True/False' => 'B4',
            'Multiple' => 'B5',
            'Numeric' => 'B6'
          ],
        ],
        [
          'classification' => 'Comprehension',
          'categories' => [
            'Identification' => 'C3',
            'True/False' => 'C4',
            'Multiple' => 'C5',
            'Numeric' => 'C6'
          ],
        ],
        [
          'classification' => 'Application',
          'categories' => [
            'Identification' => 'D3',
            'True/False' => 'D4',
            'Multiple' => 'D5',
            'Numeric' => 'D6'
          ],
        ],
        [
          'classification' => 'Analysis',
          'categories' => [
            'Identification' => 'E3',
            'True/False' => 'E4',
            'Multiple' => 'E5',
            'Numeric' => 'E6'
          ],
        ],
        [
          'classification' => 'Synthesis',
          'categories' => [
            'Identification' => 'F3',
            'True/False' => 'F4',
            'Multiple' => 'F5',
            'Numeric' => 'F6'
          ],
        ],
        [
          'classification' => 'Evaluation',
          'categories' => [
            'Identification' => 'G3',
            'True/False' => 'G4',
            'Multiple' => 'G5',
            'Numeric' => 'G6'
          ],
        ]
      ];

      foreach ($fields as &$field) {
        foreach ($field['categories'] as $category => $cellRef) {
          if (is_string($cellRef) && !empty($cellRef)) {
            $value = $sheet->getCell($cellRef)->getValue();
            $field['categories'][$category] = is_numeric($value) ? $value : 0;
          } else {
            $field['categories'][$category] = 0;
          }
        }
      }
      unset($field); // avoid accidental reference bugs

      echo json_encode($fields);
    } catch (Exception $e) {
      echo json_encode(["error" => "Error processing file: " . $e->getMessage()]);
    }
    break;
  case "create_department":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data || !isset($data["name"])) {
      echo json_encode(["message" => "Invalid input"]);
      exit;
    }

    $result = create_department(trim($data["name"]));
    echo json_encode(["message" => $result ? "Department created successfully" : "Failed to create department"]);
    break;

  case "get_all_departments":
    $departments = get_all_departments();
    echo json_encode($departments);
    break;
  case "delete_department":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data || !isset($data["id"])) {
      echo json_encode(["message" => "Invalid input"]);
      exit;
    }

    $result = delete_department((int) $data["id"]);
    echo json_encode(["message" => $result ? "Department deleted successfully" : "Failed to delete department"]);
    break;

  case "update_department":
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
      echo json_encode(["message" => "Invalid request method"]);
      exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data || !isset($data["id"]) || !isset($data["name"])) {
      echo json_encode(["message" => "Invalid input"]);
      exit;
    }

    $result = update_department((int) $data["id"], trim($data["name"]));
    echo json_encode(["message" => $result ? "Department updated successfully" : "Failed to update department"]);
    break;
  default:
    echo json_encode(["message" => "Invalid action"]);
}

function generateRandomPassword($length = 12)
{
  $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  $password = '';
  $maxIndex = strlen($chars) - 1;

  for ($i = 0; $i < $length; $i++) {
    $password .= $chars[random_int(0, $maxIndex)];
  }

  return $password;
}
