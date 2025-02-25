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
    $query = "INSERT INTO exam (exam_name, subject, access_code, questions, created_by) VALUES (?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("sssss", $exam_name, $subject, $access_code, json_encode($questions), $created_by);
    return $stmt->execute();
  }

  // Read all exams
  public function viewAll($assigned_subject)
  {
    if ($assigned_subject === "none") {
      $query = "SELECT * FROM exam"; // No WHERE condition
      $stmt = $this->conn->query($query);
    } else {
      $query = "SELECT * FROM exam WHERE subject = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $assigned_subject);
      $stmt->execute();
      $stmt = $stmt->get_result();
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }

  public function getAllQuestion($assigned_subject)
  {
    if ($assigned_subject === "none") {
      $query = "SELECT * FROM question"; // No WHERE condition
      $stmt = $this->conn->query($query);
    } else {
      $query = "SELECT * FROM question WHERE subject = ?";
      $stmt = $this->conn->prepare($query);
      $stmt->bind_param("s", $assigned_subject);
      $stmt->execute();
      $stmt = $stmt->get_result();
    }

    return $stmt->fetch_all(MYSQLI_ASSOC);
  }

  public function Export ($data) {
    $filename = "/files/export.txt";

    $file = fopen(".." . $filename, "w");

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
}?>