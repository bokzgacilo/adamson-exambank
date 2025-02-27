<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require './vendor/autoload.php';
require_once './config/database.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$action = $_GET['action'] ?? '';

switch ($action) {
    case "upload_tos":
        $fileTmpPath = $_FILES["file"]["tmp_name"];
        
        if ($_FILES["file"]["error"] !== UPLOAD_ERR_OK) {
            die(json_encode(["error" => "File upload failed!"]));
        }

        try {
            $spreadsheet = IOFactory::load($fileTmpPath);
            $sheet = $spreadsheet->getActiveSheet();
        
            $columns = [
                "Knowledge" => "A2",
                "Comprehension" => "B2",
                "Application" => "C2",
                "Analysis" => "D2",
                "Synthesis" => "E2",
                "Evaluation" => "F2"
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
