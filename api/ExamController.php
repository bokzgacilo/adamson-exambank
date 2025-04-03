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

  public function viewAll($assigned_subject)
  {
    $assigned_subjects = json_decode($assigned_subject, true);

    if (!is_array($assigned_subjects) || in_array("None", $assigned_subjects, true)) {
      $query = "SELECT * FROM exam";
      $stmt = $this->conn->query($query);
    } else {

      $placeholders = implode(',', array_fill(0, count($assigned_subjects), '?'));
      $query = "SELECT * FROM exam WHERE subject IN ($placeholders)";
      $stmt = $this->conn->prepare($query);

      $types = str_repeat("s", count($assigned_subjects));
      $stmt->bind_param($types, ...$assigned_subjects);
      $stmt->execute();
      $stmt = $stmt->get_result();
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }

  public function getAllQuestion($assigned_subject)
  {
    $assigned_subjects = json_decode($assigned_subject, true);

    if (!is_array($assigned_subjects) || in_array("none", array_map('strtolower', $assigned_subjects), true)) {
      $query = "SELECT * FROM question";
      $stmt = $this->conn->query($query);
    } else {
      $placeholders = implode(',', array_fill(0, count($assigned_subjects), '?'));
      $query = "SELECT * FROM question WHERE subject IN ($placeholders)";
      $stmt = $this->conn->prepare($query);

      $types = str_repeat("s", count($assigned_subjects));
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


  public function Export($data, $subject)
  {
    $filename = "./files/export.txt";

    $file = fopen($filename, "w");

    if ($file) {
      foreach ($data as $question) {
        $category = $question['category'];
        $questionText = $question['question'];
        $options = json_decode($question['options'], true);

        if ($category === "True/False") {
          $correctOption = "";
          foreach ($options as $option) {
            if ($option['is_correct']) {
              $correctOption = $option['option'];
              break;
            }
          }
          $correctAnswersText = $correctOption;
          $categoryLabel = "TF";
        } elseif ($category === "Identification") {
          $correctAnswersText = $options[0]['option'] ?? "N/A";
          $categoryLabel = "FIB";
        } elseif ($category === "Numeric") {
          $correctAnswersText = $options[0]['option'] ?? "N/A";
          $categoryLabel = "NUM";
        } elseif ($category === "Enumeration") {
          $correctAnswers = [];
          foreach ($options as $option) {
            if ($option['is_correct']) {
              $correctAnswers[] = $option['option'];
            }
          }
          $correctAnswersText = implode("; ", $correctAnswers);
          $categoryLabel = "Enumeration";
        } else { // Multiple Choice
          $correctAnswers = [];
          $correctCount = 0; // Track number of correct answers

          foreach ($options as $option) {
            $status = $option['is_correct'] ? "Correct" : "Incorrect";
            $correctAnswers[] = "{$option['option']}\t$status";

            if ($option['is_correct']) {
              $correctCount++; // Count correct answers
            }
          }

          $correctAnswersText = implode("\t", $correctAnswers);
          $categoryLabel = $correctCount >= 2 ? "MA" : "MC"; // Set label based on correct count
        }

        $line = "$categoryLabel\t$questionText\t$correctAnswersText";

        fwrite($file, $line . "\n");
      }

      fclose($file);
      return $filename;
    } else {
      return false;
    }
  }

  public function edit($id, $title, $description, $date)
  {
    $query = "UPDATE exam SET title = ?, description = ?, exam_date = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssi", $title, $description, $date, $id);
    return $stmt->execute();
  }

  public function delete($id)
  {
    $query = "DELETE FROM exam WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
  }
}
