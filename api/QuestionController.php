<?php
class Question
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function create($question, $options, $department, $answer, $category, $name, $subject, $term, $classification, $module)
  {
    $query = "INSERT INTO question (question, options, department, answer, category, created_by, subject, terms, classification, module) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("ssssssssss", $question, $options, $department, $answer, $category, $name, $subject, $term, $classification, $module);

    if ($stmt->execute()) {
      $last_id = $this->conn->insert_id;

      $fetch_query = "SELECT * FROM question WHERE id = ?";
      $fetch_stmt = $this->conn->prepare($fetch_query);
      $fetch_stmt->bind_param("i", $last_id);
      $fetch_stmt->execute();
      $result = $fetch_stmt->get_result();
      $data = $result->fetch_assoc();
      $stmt -> close();
      $fetch_stmt -> close();
      return $data;
    }

    return false;
  }

  public function update($id, $question, $department, $options, $answer, $category, $name, $subject, $term, $classification, $module)
  {
    $query = "UPDATE question 
      SET question = ?, 
          department = ?,
          options = ?, 
          answer = ?, 
          category = ?, 
          created_by = ?, 
          subject = ?, 
          terms = ?,
          module = ?,
          classification = ?,
          last_updated = NOW()
      WHERE id = ?";

    $stmt = $this->conn->prepare($query);
    if (!$stmt) {
      die("Prepare failed: " . $this->conn->error);
    }
    $stmt->bind_param("ssssssssssi", $question, $department, $options, $answer, $category, $name, $subject, $term, $module, $classification, $id);

    if ($stmt->execute()) {
      $fetch_query = "SELECT * FROM question WHERE id = ?";
      $fetch_stmt = $this->conn->prepare($fetch_query);
      if (!$fetch_stmt) {
        die("Prepare failed: " . $this->conn->error);
      }

      $fetch_stmt->bind_param("i", $id);
      $fetch_stmt->execute();
      $result = $fetch_stmt->get_result();
      $data = $result -> fetch_assoc();
      $stmt -> close();
      $fetch_stmt -> close();

      return $data;
    }

    return false;
  }

  public function viewAll($subjects, $type)
  {
    $subject_array = json_decode($subjects, true);
    if (!is_array($subject_array)) {
      return json_encode(["error" => "Invalid subject format"]);
    }
    if ($type === "Admin") {
      $query = "SELECT * FROM question ORDER BY date_created DESC";
      $stmt = $this->conn->query($query);
      return json_encode($stmt->fetch_all(MYSQLI_ASSOC));
    }
    if (empty($subject_array) || in_array("None", $subject_array, true)) {
      return json_encode([]); // Return empty array
    }
    $placeholders = implode(',', array_fill(0, count($subject_array), '?'));
    $query = "SELECT * FROM question WHERE subject IN ($placeholders) AND status = 1 ORDER BY date_created DESC";

    $stmt = $this->conn->prepare($query);
    if (!$stmt) {
      return json_encode(["error" => "Query preparation failed"]);
    }

    $types = str_repeat("s", count($subject_array));
    $stmt->bind_param($types, ...$subject_array);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);
    $stmt -> close();

    return json_encode($data);
  }

  public function view($id)
  {
    $query = "SELECT * FROM exams WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();
    $stmt -> close();
    return $data;
  }

  public function toggle_status($id)
  {
    $query = "UPDATE question SET status = NOT status WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $data = $stmt->execute();
    $stmt -> close();
    return $data;
  }

  public function delete($id)
  {
    $query = "DELETE FROM question WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bind_param("i", $id);
    $data = $stmt->execute();
    $stmt -> close();
    return $data;
  }
}
