<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require './vendor/autoload.php';
require_once './config/database.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$action = $_GET['action'] ?? '';

function insertQuestion($question, $options, $category, $classification, $created_by, $subject, $terms) {
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


function convertToLegendArray($baseString) {
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
          $option = [[
            "id" => 1,
            "option" => $rowData["D"] ?? null,
            "is_correct" => (isset($rowData["E"]) && in_array(strtolower($rowData["E"]), ["x"])) ? true : "" // Blank if no 'X' or 'x'
          ]];
        }

        if (isset($rowData["B"]) && in_array(strtoupper($rowData["B"]), ["ID", "NUM"])) {
          $option = [[
            "id" => 1,
            "option" => $rowData["D"] ?? null,
            "is_correct" => (isset($rowData["E"]) && in_array(strtolower($rowData["E"]), ["x"])) ? true : "" // Blank if no 'X' or 'x'
          ]];
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
  case "upload_tos":
    $fileTmpPath = $_FILES["file"]["tmp_name"];

    if ($_FILES["file"]["error"] !== UPLOAD_ERR_OK) {
      die(json_encode(["error" => "File upload failed!"]));
    }

    try {
      $spreadsheet = IOFactory::load($fileTmpPath);
      $sheet = $spreadsheet->getActiveSheet();

      $columns = [
        "Knowledge" => "B2",
        "Comprehension" => "C2",
        "Application" => "D2",
        "Analysis" => "E2",
        "Synthesis" => "F2",
        "Evaluation" => "G2"
      ];

      $data = [];

      foreach ($columns as $key => $cellRef) {
        $cellValue = $sheet->getCell($cellRef)->getValue();

        $data[$key] = (is_numeric($cellValue)) ? intval($cellValue) : 0;
      }

      echo json_encode($data);
    } catch (Exception $e) {
      echo json_encode(["error" => "Error processing file: " . $e->getMessage()]);
    }
    break;
  default:
    echo json_encode(["message" => "Invalid action"]);
}
