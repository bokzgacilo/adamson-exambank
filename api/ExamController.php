<?php
class Exam
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function create($exam_name, $subject, $access_code, $tos, $questions, $created_by)
  {
    $questionJSON = json_encode($questions);
    $tosJSON = json_encode($tos);

    $query = "INSERT INTO exam (exam_name, subject, access_code, tos, questions, created_by) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("ssssss", $exam_name, $subject, $access_code, $tosJSON, $questionJSON, $created_by);
    return $stmt->execute();
  }

  public function viewAll($subjects, $type)
  {
    // If type is ADMIN, return all exams
    if ($type === 'Admin' || $type === 'Coordinator') {
      $query = "SELECT * FROM exam";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
      $result = $stmt->get_result();
      return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Else: decode and sanitize subjects
    $subjects = trim($subjects, '"');
    $subjects = stripslashes($subjects);
    $subjectsArray = json_decode($subjects, true);

    // If subjects is empty, return empty result
    if (empty($subjectsArray)) {
      return [];
    }

    // Prepare placeholders and query
    $placeholders = implode(',', array_fill(0, count($subjectsArray), '?'));
    $query = "SELECT * FROM exam WHERE subject IN ($placeholders) AND status = 1";
    $stmt = $this->conn->prepare($query);

    // Bind parameters dynamically
    $types = str_repeat("s", count($subjectsArray));
    $stmt->bind_param($types, ...$subjectsArray);
    $stmt->execute();

    $result = $stmt->get_result();
    return $result->fetch_all(MYSQLI_ASSOC);
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
    $question_list = [];

    // Assuming you have a PDO connection stored in $this->conn
    $pdo = $this->conn;

    foreach ($tos as $entry) {
      $classification = $entry['classification'];
      $categories = $entry['categories'];

      foreach ($categories as $category => $limit) {
        if ($limit > 0) {
          // Prepare SQL query
          $query = "
            SELECT * FROM question
            WHERE subject = ? 
            AND classification = ? 
            AND category = ? 
            ORDER BY RAND()
            LIMIT ?
          ";

          if ($stmt = $this->conn->prepare($query)) {
            // Bind parameters
            $stmt->bind_param('sssi', $subject, $classification, $category, $limit);

            // Execute query
            $stmt->execute();

            // Fetch results
            $result = $stmt->get_result();
            $results = $result->fetch_all(MYSQLI_ASSOC);

            // Merge results
            $question_list = array_merge($question_list, $results);

            // Close statement
            $stmt->close();
          }
        }
      }
    }

    return $question_list;
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

  public function change_status($id, $status)
  {
    $query = "UPDATE exam SET status = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $status, $id);
    return $stmt->execute();
  }

  public function update($id, $question)
  {
    $stringedQuestion = json_encode($question);
    $query = "UPDATE exam SET questions = ? WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("si", $stringedQuestion, $id);
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
