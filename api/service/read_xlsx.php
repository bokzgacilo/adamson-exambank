<?php
require '../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

function readXlsxFile($filePath) {
    $spreadsheet = IOFactory::load($filePath);
    $sheet = $spreadsheet->getActiveSheet();

    $columns = [
        "TOTAL" => "A2",
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

    return json_encode($data);
}

$filePath = 'uploads/sample.xlsx';
header('Content-Type: application/json');
echo readXlsxFile($filePath);
