<?php
class Exam
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function create($exam_name, $subject, $access_code, $questions, $created_by)
  {
    $questionJSON = json_encode($questions);
    $query = "INSERT INTO exam (exam_name, subject, access_code, questions, created_by) VALUES (?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssss", $exam_name, $subject, $access_code, $questionJSON, $created_by);
    return $stmt->execute();
  }

  // Read all exams
  public function viewAll($assigned_subject)
  {
    $assigned_subjects = json_decode($assigned_subject, true); // Decode JSON

    if (!is_array($assigned_subjects) || in_array("None", $assigned_subjects, true)) {
      // If it's "None" or not a valid array, fetch all exams
      $query = "SELECT * FROM exam";
      $stmt = $this->conn->query($query);
    } else {
      // Fetch exams only for assigned subjects
      $placeholders = implode(',', array_fill(0, count($assigned_subjects), '?')); // Create ?, ?, ? dynamically
      $query = "SELECT * FROM exam WHERE subject IN ($placeholders)";
      $stmt = $this->conn->prepare($query);

      // Bind parameters dynamically
      $types = str_repeat("s", count($assigned_subjects)); // 's' for each subject
      $stmt->bind_param($types, ...$assigned_subjects);
      $stmt->execute();
      $stmt = $stmt->get_result();
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }

  public function getAllQuestion($assigned_subject)
  {
    $assigned_subjects = json_decode($assigned_subject, true); // Decode JSON

    if (!is_array($assigned_subjects) || in_array("none", array_map('strtolower', $assigned_subjects), true)) {
      $query = "SELECT * FROM question";
      $stmt = $this->conn->query($query);
    } else {
      // Fetch questions only for assigned subjects
      $placeholders = implode(',', array_fill(0, count($assigned_subjects), '?')); // ?, ?, ? dynamically
      $query = "SELECT * FROM question WHERE subject IN ($placeholders)";
      $stmt = $this->conn->prepare($query);

      // Bind parameters dynamically
      $types = str_repeat("s", count($assigned_subjects)); // 's' for each subject
      $stmt->bind_param($types, ...$assigned_subjects);
      $stmt->execute();
      $stmt = $stmt->get_result();
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }

  public function GenerateTOSQuestion($tos, $subject)
  {
    $final_questions = [];
    
    foreach ($tos as $classification => $count) {
      // Select random questions for the given classification
      $query = "SELECT * FROM question WHERE classification = ? AND subject = ? ORDER BY RAND() LIMIT ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("ssi", $classification, $subject, $count);
      $stmt->execute();
      $result = $stmt->get_result();

      while ($row = $result->fetch_assoc()) {
        $final_questions[] = $row;
      }
    }

    return $final_questions;
  }


  public function Export($data)
  {
    $filename = "./files/export.txt";

    $file = fopen($filename, "w");

    if ($file) {
      foreach ($data as $question) {
        $category = $question['category'] === "Multiple" ? "MC" : "TF"; // MC for multiple choice, TF for true/false
        $questionText = $question['question'];
        $options = json_decode($question['options'], true); // Decode options

        // Start the line with category and question text
        $line = "$category\t$questionText";

        // Add options with correctness
        foreach ($options as $option) {
          $optionText = $option['option'];
          $isCorrect = $option['is_correct'] ? "correct" : "incorrect";
          $line .= "\t$optionText\t$isCorrect";
        }

        // Write line to file
        fwrite($file, $line . "\n");
      }

      fclose($file);

      // Return the file link
      return $filename;
    } else {
      return false;
    }
  }

  // Update an exam
  public function edit($id, $title, $description, $date)
  {
    $query = "UPDATE exams SET title = ?, description = ?, exam_date = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssi", $title, $description, $date, $id);
    return $stmt->execute();
  }

  // Delete an exam
  public function delete($id)
  {
    $query = "DELETE FROM exams WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
  }
}
