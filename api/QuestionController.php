<?php
class Question
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function create($question, $options, $answer, $category, $name, $subject, $term, $classification)
  {
    $query = "INSERT INTO question (question, options, answer, category, created_by, subject, terms, classification) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("ssssssss", $question, $options, $answer, $category, $name, $subject, $term, $classification);

    if ($stmt->execute()) {
      $last_id = $this->conn->insert_id;

      $fetch_query = "SELECT * FROM question WHERE id = ?";
      $fetch_stmt = $this->conn->prepare($fetch_query);
      $fetch_stmt->bind_param("i", $last_id);
      $fetch_stmt->execute();
      $result = $fetch_stmt->get_result();

      return $result->fetch_assoc();
    }

    return false;
  }

  public function update($id, $question, $options, $answer, $category, $name, $subject, $term, $classification)
  {
    $query = "UPDATE question 
      SET question = ?, 
          options = ?, 
          answer = ?, 
          category = ?, 
          created_by = ?, 
          subject = ?, 
          terms = ?,
          classification = ?,
          last_updated = NOW()
      WHERE id = ?";

    $stmt = $this->conn->prepare($query);
    if (!$stmt) {
      die("Prepare failed: " . $this->conn->error);
    }

    $stmt->bind_param("ssssssssi", $question, $options, $answer, $category, $name, $subject, $term, $classification, $id);

    if ($stmt->execute()) {
      $fetch_query = "SELECT * FROM question WHERE id = ?";
      $fetch_stmt = $this->conn->prepare($fetch_query);
      if (!$fetch_stmt) {
        die("Prepare failed: " . $this->conn->error);
      }

      $fetch_stmt->bind_param("i", $id);
      $fetch_stmt->execute();
      $result = $fetch_stmt->get_result();

      return $result->fetch_assoc();
    }

    return false;
  }

  public function viewAll($subjects, $type)
{
    // Decode the JSON string to an array
    $subject_array = json_decode($subjects, true);

    // If decoding failed
    if (!is_array($subject_array)) {
        return json_encode(["error" => "Invalid subject format"]);
    }

    // ✅ If user is Admin, return all questions
    if ($type === "Admin") {
        $query = "SELECT * FROM question";
        $stmt = $this->conn->query($query);
        return json_encode($stmt->fetch_all(MYSQLI_ASSOC));
    }

    // ✅ If subject list is empty or contains "None", return empty
    if (empty($subject_array) || in_array("None", $subject_array, true)) {
        return json_encode([]); // Return empty array
    }

    // ✅ Else: Filter based on subjects
    $placeholders = implode(',', array_fill(0, count($subject_array), '?'));
    $query = "SELECT * FROM question WHERE subject IN ($placeholders)";
    
    $stmt = $this->conn->prepare($query);
    if (!$stmt) {
        return json_encode(["error" => "Query preparation failed"]);
    }

    $types = str_repeat("s", count($subject_array));
    $stmt->bind_param($types, ...$subject_array);
    $stmt->execute();
    $result = $stmt->get_result();

    return json_encode($result->fetch_all(MYSQLI_ASSOC));
}


  public function QuestionForBank($subject)
  {
    $query = "SELECT id, question, options, category, classification 
          FROM question 
          WHERE subject = ? AND status <> 0";

    $stmt = $this->conn->prepare($query);
    if ($stmt === false) {
      return json_encode(["error" => "Failed to prepare statement"]);
    }

    $stmt->bind_param("s", $subject);

    if (!$stmt->execute()) {
      return json_encode(["error" => "Execution failed"]);
    }

    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    return json_encode($data);
  }

  public function view($id)
  {
    $query = "SELECT * FROM exams WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_assoc();
  }

  public function toggle_status($id)
  {
    $query = "UPDATE question SET status = NOT status WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
  }

  public function delete($id)
  {
    $query = "DELETE FROM question WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
  }
}
